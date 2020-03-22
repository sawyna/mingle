const listen = (channel, callback) => {
    channel.onMessage.addListener((message) => {
        console.log(`received message`);
        console.log(message);
        callback(message);
    })
}

const send = (channel, message) => {
    channel.postMessage(message);
}

export default {
    send,
    listen,
}
