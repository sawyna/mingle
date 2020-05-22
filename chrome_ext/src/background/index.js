import lodash from 'lodash-core';

import MingleChannelNode from "../common/MingleChannelNode";
import MingleClient from "../common/MingleClient";
import Util from '../common/Util';
import GA from '../common/GA';

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
    if (lodash.isNil(tabId)) {
        console.log('Do not set badge text will null tabId');
        return;
    }
    fetch(`${Util.getServerURL()}/channel/${channelId}/count`)
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
GA.invoke('send', 'pageview', '/background'); // Set page, avoiding rejection due to chrome-extension protocol

chrome.runtime.onInstalled.addListener((details) => {
    console.log('Sending ext installed event');
    console.log(details);
    GA.invoke('send', 'event', 'INSTALL', details.reason, details.previousVersion);
});

// callback to GA because ga may not be initialised at that point.
GA.invoke(() => {
    let dev = Util.isDevelopment() ? '1' : '0';
    const uninstallURL = `${Util.getServerURL()}/uninstall?dev=${dev}&cid=${GA.clientId}`;
    chrome.runtime.setUninstallURL(uninstallURL);
});

