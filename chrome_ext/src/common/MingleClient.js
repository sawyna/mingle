import io from 'socket.io-client';


export default class MingleClient {
    constructor() {
        this.socket = io('http://34.210.140.190:5000');
        this.setup();
    }

    setup() {
        this.socket.on('connect', () => {
            console.log('Yay connected to backend socket');
        });
        
        this.socket.on('disconnect', (reason) => {
            console.log(`Disconnected due to ${reason}`);
        });        
    }

    send(message) {
        if (message.action === 'MINGLE_JOIN') {
            this.socket.emit('client_join', message);
        }
        else if (message.action === 'MINGLE_FORWARD') {
            this.socket.emit('client_send', message);
        }
    }

    receive(callback) {
        this.socket.on('channel_sync', (message) => {
            console.log(`Received channel_sync message `);
            console.log(message);
            callback(message['payload']);
        });
    }
}