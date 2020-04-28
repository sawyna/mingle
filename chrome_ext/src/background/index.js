import lodash from 'lodash-core';

import MingleChannelNode from "../common/MingleChannelNode";
import MingleClient from "../common/MingleClient";
import Util from '../common/Util';
import Constants from '../common/Constants';

const _CACHE = {};

chrome.runtime.onMessage.addListener(({ action, channelName }, sender, sendResponse) => {
    if (action === 'NEW_MINGLE_CHANNEL') {
        initMCSink(channelName);
    }

    else if (action === 'MINGLE_FETCH_TAB_ID') {
        sendResponse({
            tabId: sender.tab.id,
        });
    }
});

const initMCSink = function (channelName) {
    if (lodash.has(_CACHE, channelName)) {
        console.log('Page reloaded and client wants to connect agagin');
        const oldStuff = _CACHE[channelName];
        try {
            oldStuff.mingleClient.disconnect();
            oldStuff.mcSink.teardown();
            clearInterval(oldStuff.badgeHandler);
        }
        catch (err) {
            console.log(err);
            console.log('Failed to teardown');
        }

        delete _CACHE[channelName];
    }

    const mingleClient = new MingleClient();
    console.log(`creating a new sink for ${channelName}`);
    const mcSink = new MingleChannelNode('sink', channelName, (msg) => {
        console.log(`received for sink ${mcSink.channel_name}`);
        console.log(msg);
        if (msg.action === 'MINGLE_JOIN') {
            clearInterval(_CACHE[channelName].badgeHandler);
            _CACHE[channelName].badgeHandler = initBadge(msg);
        }
        else if (msg.action === 'MINGLE_DISCONNECT') {
            clearInterval(_CACHE[channelName].badgeHandler);
        }
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

let initBadge = (msg) => {
    console.log('Receive badge inti request');
    return Util.customSetInterval(() => {
        const channelId = msg.channelId;
        const tabId = msg.tabId;
        setBadgeText(channelId, tabId);
    }, 2000, true);
}

let setBadgeText = (channelId, tabId) => {
    fetch(`${Constants.SERVER_URL}/channel/${channelId}/count`)
    .then(response => response.text())
    .then((userCount) => {
        console.log(userCount);
        if (userCount === '0') {
            userCount = '';
        }

        chrome.browserAction.setBadgeText({
            text: userCount,
            tabId: tabId,
        });
    })
    .catch((err) => {
        console.log(err);
    });
}


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
ga('send', 'pageview', '/background'); // Set page, avoiding rejection due to chrome-extension protocol

chrome.runtime.onInstalled.addListener((details) => {
    console.log('Sending ext installed event');
    console.log(details);
    ga('send', 'event', 'INSTALL', details.reason, details.previousVersion);
});
