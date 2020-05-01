import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Turnoff from '../../images/turnoff_128.png';
import Turnon from '../../images/turnon_128.png';
import Util from '../common/Util';

export default class MingleButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    _handleClick(tab) {
        const { active } = this.props;
        let currentURL = new URL(tab.url);
        let mingleUrl;

        if (active) {
            currentURL.searchParams.delete('mingleChannelId');
            mingleUrl = currentURL.toString();
        }
        else {
            let channelId = uuidv4();
            currentURL.searchParams.set('mingleChannelId', channelId);
            mingleUrl = currentURL.toString();
            ga('send', 'event', 'CREATE_CHANNEL', currentURL.hostname);
            Util.copyToClipboard(mingleUrl);
        }
        
        chrome.tabs.sendMessage(tab.id, {
            action: 'MINGLE_RELOAD',
            payload: {
                url: mingleUrl,
            },
        });
        window.close();
    }

    handleClick() {
        Util.getCurrentTab()
            .then(tab => this._handleClick(tab));
    }



    render() {
        const { active } = this.props;
        const btnImage = active ? Turnon : Turnoff;
        return (
            <button className="btn" onClick={this.handleClick}>
                <img src={btnImage} />
            </button>
        );
    }
}