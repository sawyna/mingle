import io from 'socket.io-client';
import Util from './Util';

export default class MingleClient {
    constructor() {
        this.socket = io(Util.getServerURL());
        this.setup();
    }

    disconnect() {
        console.log('Disconnecting socket');
        this.socket.disconnect();
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
        else if (message.action === 'MINGLE_DISCONNECT') {
            this.disconnect();
        }
    }

    receive(callback) {
        this.socket.on('channel_sync', (message) => {
            console.log(`Received channel_sync message `);
            console.log(message);
            callback(message);
        });
    }
}