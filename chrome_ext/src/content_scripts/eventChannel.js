let contentPort = chrome.runtime.connect({
    name: 'mingle-content'
 });

let handleScriptEvent = (event) => {
    if(event.data.action === 'MINGLE_FORWARD' || event.data.action === 'MINGLE_JOIN') {
        console.log(`received event in content script`);
        console.log(event.data);
        contentPort.postMessage(event.data);
     }
}

let scriptEvents = () => {
    window.addEventListener('message', handleScriptEvent, false);
}

let contentEvents = () => {
    contentPort.onMessage.addListener((message) => {
        window.postMessage({
            action: 'MINGLE_RECEIVE',
            payload: message,
        });
    });
}

let init = () => {
    scriptEvents();
    contentEvents();
};

export default {
    init: init,
};