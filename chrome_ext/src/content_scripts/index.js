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
        WindowHelpers.send({
            action: 'MINGLE_RECEIVE',
            payload: msg,
        });    
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

ScriptInjector.inject();
scriptEvents();
