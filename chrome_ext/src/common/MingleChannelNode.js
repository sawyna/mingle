export default class MingleChannelNode {
    constructor(type, channel_name, handleReceive) {
        this.type = type;
        this.channel_name = channel_name;
        this.handleReceive = handleReceive;
        this.channel = null;

        this.setup = this.setup.bind(this);
        this._setup = this._setup.bind(this);
        this.setup();
    }

    setup() {
        if (this.type === 'source') {
            this.channel = chrome.runtime.connect({ name: this.channel_name });
            this._setup();
        }
        else if (this.type == 'sink') {
            chrome.runtime.onConnect.addListener((_channel) => {
                if (_channel.name === this.channel_name) {
                    this.channel = _channel;
                    this._setup();
                }
            });
        }
    }

    _setup() {
        this.channel.onDisconnect.addListener(() => {
            // try to reconnect if the connection is gone
            this.setup();
        });

        this.channel.onMessage.addListener(this.handleReceive);
    }

    send(msg) {
        console.log(`posting message from ${this.type}`);
        console.log(msg);
        this.channel.postMessage(msg);
    }
}