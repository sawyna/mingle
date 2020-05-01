import { v4 as uuidv4 } from 'uuid';
import WindowHelpers from '../common/WindowHelpers';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('app'),
);

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
ga('send', 'pageview', '/popup'); // Set page, avoiding rejection due to chrome-extension protocol
