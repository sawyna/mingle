const SERVER_URL = 'http://34.210.140.190:5000';
// const SERVER_URL = 'http://localhost:5000';

const APP_MODES = {
    DEV: 'development',
    PROD: 'production',
}

const MINGLE_ENABLED_HOSTS = [
    'youtube',
    'netflix',
    'amazon',
    'primevideo',
];

const MINGLE_ENABLED_SITES = {
    Youtube: 'https://www.youtube.com',
    Netflix: 'https://www.netflix.com',
    Primevideo: 'https://primevideo.com',
};

export default {
    SERVER_URL,
    APP_MODES,
    MINGLE_ENABLED_HOSTS,
    MINGLE_ENABLED_SITES,
}