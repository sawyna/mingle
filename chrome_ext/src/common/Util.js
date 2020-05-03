import lodash from 'lodash-core';

import Constants from './Constants';

const _MINGLE_ENABLED_HOSTS = [
    'youtube',
    'netflix',
    'amazon',
    'primevideo',
];

const getMingleChannel = (url) => {
    if (lodash.isUndefined(url)) {
        url = document.URL;
    }
    console.log(`getting mingle channel for url: ${url}`);
    const urlInstance = new URL(url);
    return urlInstance.searchParams.get('mingleChannelId');
};

const isMingleActive = (url) => {
    return !lodash.isNil(getMingleChannel(url));
}

const isMingleActiveExternal = () => {
    return getCurrentTab()
        .then(tab => isMingleActive(tab.url));
}

const isMingleEnabled = () => {
    const url = new URL(document.URL);
    const hostname = url.hostname;

    return _MINGLE_ENABLED_HOSTS.some((host) => host in hostname);
}

const isDevelopment = () => {
    if (process.env.NODE_ENV === Constants.APP_MODES.DEV) {
        return true;
    }

    return false;
}

const isProduction = () => {
    if (process.env.NODE_ENV === Constants.APP_MODES.PROD) {
        return true;
    }

    return false;
}

/**
 * Common utility functions
 */

const customSetInterval = (func, timeout, immediate) => {
    if (immediate) {
        func();
    }

    return setInterval(func, timeout);
}

const copyToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

/**
 * Chrome utility functions
 */

const getCurrentTab = () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
            }, (tabs) => {
                resolve(tabs[0]);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}

/**
 * GA utilities
 */
const customGA = (func, ...args) => {
    if (process.env.NODE_ENV === Constants.APP_MODES.DEV) {
        console.log(`Ignoring ga on dev mode`);
        return;
    }

    func(...args);
}

export default {
    getMingleChannel,
    isMingleActive,
    isMingleActiveExternal,
    isMingleEnabled,
    isDevelopment,
    isProduction,
    customSetInterval,
    copyToClipboard,
    getCurrentTab,
    customGA,
}