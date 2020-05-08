import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash-core';

import WindowHelpers from '../common/WindowHelpers';
import Util from '../common/Util';

class VideoPlayerProxy {
    constructor() {
        
        this.addEventListeners = this.addEventListeners.bind(this);
        this.forward = this.forward.bind(this);
        this.receive = this.receive.bind(this);
        this.handleReceiveEvents = this.handleReceiveEvents.bind(this);
        this.maybeJoinRoom = this.maybeJoinRoom.bind(this);
        this.getCurrentPlatform = this.getCurrentPlatform.bind(this);
        this.createMinglePayload = this.createMinglePayload.bind(this);

        this._initPlayers = this._initPlayers.bind(this);

        this.currentPlatform = this.getCurrentPlatform();

        this.userId = uuidv4();
        this.parity = 0;
        this.init();
    }

    _initPlayers() {
        let player = null;
        this.p = null;
        this.originalp = null;

        try {
            if (this.currentPlatform === 'netflix') {
                const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
                const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
                this.p = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
                this.originalp = document.querySelectorAll('video')[0];
            }
            else if (this.currentPlatform === 'primevideo') {
                let videoPlayers = document.querySelectorAll('video');
                let videoPlayer = null;
                for (let i = 0; i < videoPlayers.length; i++) {
                    videoPlayer = videoPlayers[i];
                    if (videoPlayer.src !== undefined && (videoPlayer.src.includes('primevideo') || videoPlayer.src.includes('amazon'))) {
                        this.p = videoPlayer;
                        this.originalp = videoPlayer;
                        break;
                    }
                }
            }
            else {
                this.p = document.querySelectorAll('video')[0];
                this.originalp = this.p;
            }
        }
        catch (err) {
            console.log(`Failed to init player: ${err}`);
        }
    }

    init() {
        this._initPlayers();
        console.log('Initialising video player proxy');
        console.log(this.p);
        console.log(this.originalp);

        if (lodash.isNil(this.p) || lodash.isNil(this.originalp)) {
            return;
        }

        const joinedRoom = this.maybeJoinRoom();
        if (!joinedRoom) {
            return;
        }

        this.addEventListeners([
            {
                type: 'play',
            },
            {
                type: 'pause',
            }
        ]);
        this.addKeyboardEventListeners();

        this.receive();

        window.addEventListener('beforeunload', (e) => {
            this.forward(this.createMinglePayload('MINGLE_DISCONNECT'));
        });
    }

    createMinglePayload(action, payload) {
        return {
            action: action,
            userId: this.userId,
            channelId: this.getCurrentChannel(),
            payload: payload,
        };
    }

    maybeJoinRoom() {
        const currentChannelId = this.getCurrentChannel();
        console.log(`Getting a new current channel ${currentChannelId}`);
        if (lodash.isNil(currentChannelId)) {
            // bail out if there is no session id
            return false;
        }
        this.forward(this.createMinglePayload('MINGLE_JOIN'));
        return true;
    }

    getCurrentPlatform() {
        const url = new URL(document.URL);
        if (url.host.includes('netflix')) {
            return 'netflix';
        }

        if (url.host.includes('primevideo') || url.host.includes('amazon')) {
            return 'primevideo';
        }

        return 'other';
    }

    addEventListeners(events) {
        // add events to the actual html5 player
        events.map(event => {
            this.originalp.addEventListener(event.type, (e) => {
                console.log(`event listener: ${event.type}, parity: ${this.parity}`);
                if (this.parity === 1) {
                    this.parity = 0;
                    return;
                }
                
                console.log(`forwading event of type ${event.type}`);
                this.forward(this.createMinglePayload('MINGLE_FORWARD', {
                    type: event.type,
                    timestamp: e.srcElement.currentTime,
                }));
            });
        });
    }

    addKeyboardEventListeners() {
        if (this.currentPlatform === 'netflix' || this.currentPlatform === 'primevideo') {
            return;
        }
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                if (this.originalp.paused) {
                    console.log('ignore arrow press when video is paused. play event is triggered anyway');
                    return;
                }

                if (this.parity === 1) {
                    console.log('calm down when you receive events from others');
                    return;
                }

                this.forward(this.createMinglePayload('MINGLE_FORWARD', {
                    type: 'play',
                    timestamp: this.getCurrentTimeInSec(),
                }))
            }
        })
    }

    getCurrentChannel() {
        const url = new URL(document.URL);
        return url.searchParams.get('mingleChannelId');
    }

    forward(message) {
        console.log('in forward');
        console.log(message);
        if (lodash.isNil(message.channelId)) {
            console.log('ignoring non existentn channelId');
            return;
        }
        WindowHelpers.send(message);
    }
    
    receive() {
        WindowHelpers.receive(['MINGLE_RECEIVE'], (msg) => {
            this.handleReceiveEvents(msg);
        });
    }

    handleReceiveEvents(message) {
        console.log('received message');
        console.log(message);
        if (message.userId === this.userId) {
            console.log('ignoring my triggers');
            return;
        }

        if (message.channelId !== this.getCurrentChannel()) {
            console.log('Ignoring events from other channels');
            return;
        }

        const payload = message.payload;
        console.log(`trying to ${payload.type}`);
        if (payload.type === 'play') {
            this.parity = 1;
            this.play(payload.timestamp);
        }

        if (payload.type === 'pause') {
            this.parity = 1;
            this.pause();
        }
    }

    // video wrappers
    getCurrentTimeInSec() {
        if (this.currentPlatform === 'netflix') {
            return this.p.getCurrentTime() / 1000;
        }
        else {
            return this.p.currentTime;
        }
    }

    play(timeSec) {
        if (this.currentPlatform === 'netflix') {
            this.p.seek(timeSec * 1000);
            this.p.play();
        }
        else {
            this.p.currentTime = timeSec;
            this.p.play();
        }
    }

    pause() {
        this.p.pause();
    }
}

let init = () => {
    if (!Util.isMingleEnabled()) {
        console.log('Skipping mingle script init');
        return;
    }

    let intervalId, vpp;
    intervalId = Util.customSetInterval(() => {
        if (!lodash.isNil(lodash.get(vpp, 'originalp'))) {
            clearInterval(intervalId);
            return;
        }

        if (!Util.isMingleActive()) {
            clearInterval(intervalId);
            return;
        }
        
        vpp = new VideoPlayerProxy();
        
    }, 1000, true);
}

init();

