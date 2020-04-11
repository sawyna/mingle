import { v4 as uuidv4 } from 'uuid';
import WindowHelpers from '../common/WindowHelpers';

let createChannel = () => {
    let button = document.getElementById('start_channel');
    button.onclick = handleStartChannel;
}

let handleStartChannel = (e) => {
    let channelId = uuidv4();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log(tabs[0]);
        let currentURL = new URL(tabs[0].url);
        currentURL.searchParams.set('mingleChannelId', channelId);
        let mingleUrl = currentURL.toString();
        copyToClipboard(mingleUrl);
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'MINGLE_RELOAD',
            payload: {
                url: mingleUrl,
            },
        });
    });
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

createChannel();
