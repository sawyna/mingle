import lodash from 'lodash-core';

import ScriptInjector from './ScriptInjector';
import WindowHelpers from "../common/WindowHelpers";
import MingleChannelNode from '../common/MingleChannelNode';


let _MC_SOURCES = {};

let getOrCreateSource = (userId) => {
    if (lodash.has(_MC_SOURCES, userId)) {
        return _MC_SOURCES[userId];
    }

    chrome.runtime.sendMessage({
        action: 'NEW_MINGLE_CHANNEL',
        channelName: `mingle-content-${userId}`,
    });

    const mcSource = new MingleChannelNode('source', `mingle-content-${userId}`, (msg) => {
        msg.action = 'MINGLE_RECEIVE';
        WindowHelpers.send(msg);    
    });
    _MC_SOURCES[userId] = mcSource;
    return mcSource;
}

let scriptEvents = () => {
    WindowHelpers.receive(['MINGLE_FORWARD', 'MINGLE_JOIN', 'MINGLE_DISCONNECT'], (msg) => {
        const mcSource = getOrCreateSource(msg['userId']);
        if (mcSource) {
            mcSource.send(msg);
        }
    });
}

chrome.runtime.onMessage.addListener((msg) => {
    console.log(`received in content script MINGLE_RELOAD ${msg}`);
    if (msg.action === 'MINGLE_RELOAD') {
        const url = msg.payload.url;
        alert("URL copied to clipboard :). Share this with your loved ones and enjoy!");
        window.location.href = url;
    }
});

ScriptInjector.inject();
scriptEvents();
