import lodash from 'lodash-core';

import Util from './Util';

class GA {
    constructor(id) {
        this.id = id;
        this.init = this.init.bind(this);
        this.invoke = this.invoke.bind(this);

        this.init();
    }

    init() {
        if (Util.isDevelopment()) {
            console.log('Skipping GA init');
            return;
        }

        (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        this.invoke('create', this.id, 'auto');
        // Modifications: 
        this.invoke('set', 'checkProtocolTask', null); // Disables file protocol checking.
    }

    invoke(...args) {
        if (Util.isDevelopment()) {
            console.log('Skipping GA');
            return;
        }
        window.ga(...args);
    }

    get clientId() {
        if (Util.isDevelopment()) {
            return 'ga-dev';
        }

        let tracker = window.ga.getAll();
        if (!lodash.isNil(tracker) && tracker.length > 0) {
            return tracker[0].get('clientId');
        }
    }
}

// export a single instance. Different runtimes (popup, background) will automatically be in different instances.
const gaInstance = new GA('UA-163387829-1');
export default gaInstance;