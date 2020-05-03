import { v4 as uuidv4 } from 'uuid';
import WindowHelpers from '../common/WindowHelpers';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GA from '../common/GA';

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);

/**
 * Google Analytics
 */
GA.invoke('send', 'pageview', '/popup'); // Set page, avoiding rejection due to chrome-extension protocol
