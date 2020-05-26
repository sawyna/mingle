import lodash from 'lodash-core';

import ScriptInjector from './ScriptInjector';
import WindowHelpers from "../common/WindowHelpers";
import MingleChannelNode from '../common/MingleChannelNode';
import Util from '../common/Util';


let _MC_SOURCES = {};
let tabId = null;

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
            msg['tabId'] = tabId;
            mcSource.send(msg);
        }
    });
}

let init = () => {
    if (!Util.isMingleEnabled()) {
        console.log('Skipping content script init because mingle is not enabled');
        return;
    }
    chrome.runtime.onMessage.addListener((msg) => {
        console.log(`received in content script MINGLE_RELOAD ${msg}`);
        if (msg.action === 'MINGLE_RELOAD') {
            /**
             * Msg from popup
             */
            const url = msg.payload.url;
            // alert("URL copied to clipboard :). Share this with your loved ones and enjoy!");
            window.location.href = url;
        }
    });


    /**
     * Unfortunate way to fetch current tabId
     */
    chrome.runtime.sendMessage({
        action: 'MINGLE_FETCH_TAB_ID'
    }, (response) => {
        console.log(`receive tabId`);
        console.log(response);
        tabId = response.tabId;
        ScriptInjector.inject();
        scriptEvents();
    });
}

init();
