import lodash from 'lodash-core';

import MingleChannelNode from "../common/MingleChannelNode";
import MingleClient from "../common/MingleClient";

const _CACHE = {};

chrome.runtime.onMessage.addListener(({ action, channelName }) => {
    if (action === 'NEW_MINGLE_CHANNEL') {
        initMCSink(channelName);
    }
});

const initMCSink = function (channelName) {
    if (lodash.has(_CACHE, channelName)) {
        console.log('Page reloaded and client wants to connect agagin');
    }

    const mingleClient = new MingleClient();
    const mcSink = new MingleChannelNode('sink', channelName, (msg) => {
        console.log(`received for sink ${mcSink.channel_name}`);
        mingleClient.send(msg);
    });

    mingleClient.receive((msg) => {
        console.log(`received from client ${mcSink.channel_name}`);
        mcSink.send(msg);
    });

    _CACHE[channelName] = {
        'mcSink': mcSink,
        'mingleClient': mingleClient,
    };
}