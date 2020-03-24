const receive = (actions, handleReceive) => {
    window.addEventListener('message', (event) => {
        if (actions.includes(event.data.action)) {
            handleReceive(event.data);
        }
    });
};

const send = (msg) => {
    window.postMessage(msg, '*');
}


export default {
    send,
    receive,
}