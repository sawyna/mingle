import lodash from 'lodash-core';

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

const isMingleActive = () => {
    return lodash.isNil(getMingleChannel());
}

const isMingleEnabled = () => {
    const url = new URL(document.URL);
    const hostname = url.hostname;

    return _MINGLE_ENABLED_HOSTS.some((host) => host in hostname);
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


export default {
    getMingleChannel,
    isMingleActive,
    isMingleEnabled,
    customSetInterval,
}