import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash-core';

import WindowHelpers from '../common/WindowHelpers';

class VideoPlayerProxy {
    constructor() {
        
        this.addEventListeners = this.addEventListeners.bind(this);
        this.forward = this.forward.bind(this);
        this._createPlayPayload = this._createPlayPayload.bind(this);
        this.receive = this.receive.bind(this);
        this.handleReceiveEvents = this.handleReceiveEvents.bind(this);
        this.maybeJoinRoom = this.maybeJoinRoom.bind(this);
        this.getCurrentPlatform = this.getCurrentPlatform.bind(this);
        this.initPlayers = this.initPlayers.bind(this);

        this.currentPlatform = this.getCurrentPlatform();
        this.initPlayers();
        console.log('Initialising video player proxy');
        console.log(this.p);

        if (this.p === null) {
            return;
        }

        this.userId = uuidv4();
        this.parity = 0;
        this.init();
    }

    initPlayers() {
        let player = null;

        try {
            if (this.currentPlatform === 'netflix') {
                const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
                const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
                player = videoPlayer.getVideoPlayerBySessionId(playerSessionId);
            }
            else {
                player = document.querySelectorAll('video')[0];
            }

            this.p = player;
            this.originalp = document.querySelectorAll('video')[0];
        }
        catch (err) {
            console.log(`Failed to init player: ${err}`);
        }
    }

    init() {
        const joinedRoom = this.maybeJoinRoom();
        if (!joinedRoom) {
            return;
        }

        this.addEventListeners([
            {
                type: 'play',
                createPayload: this._createPlayPayload,
            },
            {
                type: 'pause',
                createPayload: this._createPlayPayload,
            }
        ]);
        this.receive();

        window.addEventListener('beforeunload', (e) => {
            WindowHelpers.send({
                action: 'MINGLE_DISCONNECT',
                userId: this.userId,
                channelId: this.getCurrentChannel(),     
            })
        });
    }

    maybeJoinRoom() {
        const currentChannelId = this.getCurrentChannel();
        console.log(`Getting a new current channel ${currentChannelId}`);
        if (lodash.isNil(currentChannelId)) {
            // bail out if there is no session id
            return false;
        }
        WindowHelpers.send({
            action: 'MINGLE_JOIN',
            userId: this.userId,
            channelId: currentChannelId,
        });
        return true;
    }

    getCurrentPlatform() {
        const url = new URL(document.URL);
        if (url.host.includes('netflix')) {
            return 'netflix';
        }

        return 'other';
    }

    _createPlayPayload(e, type) {
        console.log(e);
        return {
            type: type,
            userId: this.userId,
            channelId: this.getCurrentChannel(),
            data: {
                timestamp: e.srcElement.currentTime,
            }
        }
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
                this.forward(event.createPayload(e, event.type));
            });
        });
    }

    getCurrentChannel() {
        const url = new URL(document.URL);
        return url.searchParams.get('mingleChannelId');
    }

    forward(payload) {
        if (lodash.isNil(payload['channelId'])) {
            console.log('ignoring non existentn channelId');
            return;
        }
        WindowHelpers.send({
            action: 'MINGLE_FORWARD',
            payload: payload,
        });
    }

    receive() {
        WindowHelpers.receive(['MINGLE_RECEIVE'], (msg) => {
            this.handleReceiveEvents(msg.payload);
        });
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

    getCurrenTimeInSec() {
        if (this.currentPlatform === 'netflix') {
            return this.p.getCurrentTime() / 1000;
        }
        else {
            this.p.currentTime;
        }
    }

    handleReceiveEvents(message) {
        if (message.userId === this.userId) {
            console.log('ignoring my triggers');
            return;
        }

        if (message.channelId !== this.getCurrentChannel()) {
            console.log('Ignoring events from other channels');
            return;
        }

        console.log(`trying to ${message.type}`);
        if (message.type === 'play') {
            this.parity = 1;
            this.play(message.data.timestamp);
        }

        if (message.type === 'pause') {
            this.parity = 1;
            this.pause();
        }
    }
}

let init = setInterval(() => {
    if (document.querySelectorAll('video')[0] !== undefined) {
        new VideoPlayerProxy();
        clearInterval(init);
    }
}, 1000);