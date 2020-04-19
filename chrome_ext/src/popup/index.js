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

        ga('send', 'event', 'CREATE_CHANNEL', currentURL.hostname);
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

/**
 * Google Analytics
 */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
ga('create', 'UA-163387829-1', 'auto');
// Modifications: 
ga('set', 'checkProtocolTask', null); // Disables file protocol checking.
ga('send', 'pageview', '/popup'); // Set page, avoiding rejection due to chrome-extension protocol
