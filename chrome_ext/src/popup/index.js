import { v4 as uuidv4 } from 'uuid';

let createChannel = () => {
    let button = document.getElementById('start_channel');
    button.onclick = handleStartChannel;
}

let handleStartChannel = (e) => {
    let channelId = uuidv4();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let currentURL = new URL(tabs[0].url);
        currentURL.searchParams.set('mingleChannelId', channelId);
        document.getElementById('channel_id').value = currentURL.toString();
    });
}

createChannel();
