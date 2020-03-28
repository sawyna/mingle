import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash-core';

import WindowHelpers from '../common/WindowHelpers';

class VideoPlayerProxy {
    constructor() {
        // TODO implement a platform based query selector
        this.p = document.querySelectorAll('video')[0];
        console.log('Initialising video player proxy');
        console.log(this.p);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.forward = this.forward.bind(this);
        this._createPlayPayload = this._createPlayPayload.bind(this);
        this.receive = this.receive.bind(this);
        this.handleReceiveEvents = this.handleReceiveEvents.bind(this);
        this.maybeJoinRoom = this.maybeJoinRoom.bind(this);
        this.userId = uuidv4();
        this.parity = 0;
        this.init();
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
        events.map(event => {
            this.p.addEventListener(event.type, (e) => {
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

    handleReceiveEvents(message) {
        if (message.userId === this.userId) {
            console.log('ignoring my triggers');
            return;
        }

        if (message.channelId !== this.getCurrentChannel()) {
            console.log('Ignoring events from other channels');
            return;
        }

        this.parity = 1;
        if (message.type === 'play') {
            this.p.currentTime = message.data.timestamp;
            this.p.play();
        }

        if (message.type === 'pause') {
            this.p.pause();
        }
    }
}

let init = setInterval(() => {
    if (document.querySelectorAll('video')[0] !== undefined) {
        new VideoPlayerProxy();
        clearInterval(init);
    }
}, 2000);