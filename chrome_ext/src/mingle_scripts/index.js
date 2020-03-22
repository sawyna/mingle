import { v4 as uuidv4 } from 'uuid';

class VideoPlayerProxy {
    constructor() {
        this.p = document.querySelectorAll('video')[0];
        console.log('Initialising video player proxy');
        console.log(this.p);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.forwardEvent = this.forwardEvent.bind(this);
        this._createPlayPayload = this._createPlayPayload.bind(this);
        this.receive = this.receive.bind(this);
        this.handleReceiveEvents = this.handleReceiveEvents.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.userId = uuidv4();
        this.init();
    }

    init() {
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
        this.joinRoom();

        this.receive();
    }

    joinRoom() {
        window.postMessage({
            action: 'MINGLE_JOIN',
            payload: {
                userId: this.userId,
                channelId: this.getCurrentChannel(),
            }
        });
    }

    _createPlayPayload(e, type) {
        console.log(e);
        return {
            type: type,
            'userId': this.userId,
            channelId: this.getCurrentChannel(),
            data: {
                timestamp: e.srcElement.currentTime,
            }
        }
    }

    addEventListeners(events) {
        events.map(event => {
            this.p.addEventListener(event.type, (e) => {
                console.log(`forwading event of type ${event.type}`);
                this.forwardEvent(event.createPayload(e, event.type));
            });
        });
    }

    getCurrentChannel() {
        return 'yash';
        const url = new URL(document.URL);
        return url.searchParams.get('mingleChannelId');
    }

    forwardEvent(payload) {
        window.postMessage({
            action: 'MINGLE_FORWARD',
            payload: payload,
        }, '*');
    }

    receive() {
        window.addEventListener('message', (event) => {
            const { data } = event;
            if (data.action === 'MINGLE_RECEIVE') {
                this.handleReceiveEvents(data.payload);
            }
        })
    }

    handleReceiveEvents(message) {
        if (message.userId === this.userId) {
            console.log('ignoring my triggers');
            return;
        }
        if (message.type === 'play') {
            this.p.currentTime = message.data.timestamp;
            this.p.play();
        }

        if (message.type === 'pause') {
            this.p.pause();
        }
    }
}

new VideoPlayerProxy();