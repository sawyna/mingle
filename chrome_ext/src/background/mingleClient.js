import io from 'socket.io-client';


const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log('Yay connected to backend socket');
});

const send = (message) => {
    if (message.action === 'MINGLE_JOIN') {
        socket.emit('client_join', message);
    }
    else if (message.action === 'MINGLE_FORWARD') {
        socket.emit('client_send', message);
    }
}

const receive = (callback) => {
    socket.on('channel_sync', (message) => {
        console.log(`Received channel_sync message `);
        console.log(message);
        callback(message['payload']);
    });
}

export default {
    send,
    receive,
};