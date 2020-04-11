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
        const oldStuff = _CACHE[channelName];
        try {
            oldStuff.mingleClient.disconnect();
            oldStuff.mcSink.teardown();
        }
        catch (err) {
            console.log(err);
            console.log('Failed to teardown');
        }

        delete _CACHE[channelName];
    }

    const mingleClient = new MingleClient();
    const mcSink = new MingleChannelNode('sink', channelName, (msg) => {
        console.log(`received for sink ${mcSink.channel_name}`);
        console.log(msg);
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
};


/**
 * Google Analytics
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
ga('create', 'UA-163387829-1', 'auto');

chrome.runtime.onInstalled.addListener((details) => {
    console.log('Sending ext installed event');
    console.log(details);
    ga('send', 'event', 'INSTALL', details.reason, details.previousVersion);
});
