import React from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import lodash from 'lodash-core';

import Util from '../common/Util';

export default class MingleContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUserCount: '1',
            tab: null,
            alertContent: 'Copy URL',
        }

        this.handleShareClick = this.handleShareClick.bind(this);
    }

    get tabId() {
        const { tab } = this.state;
        if (lodash.isNil(tab)) {
            return null;
        }
        
        return tab.id;
    }

    handleActiveUserCount() {
        console.log(this.tabId);
        chrome.browserAction.getBadgeText({
            tabId: this.tabId,
        }, (result) => {
            if (lodash.isNil(result)) {
                return;
            }
            
            this.setState({
                activeUserCount: result,
            });
        });
    }

    handleShareClick() {
        Util.getCurrentTab()
        .then(tab => {
            Util.copyToClipboard(tab.url);
            this.setState({
                alertContent: 'Copied!',
            });
        });
    }

    componentDidMount() {
        Util.getCurrentTab().then(tab => {
            console.log(tab);
            this.setState({ tab }, () => {
                this.handleActiveUserCount();
            });
        });
    }

    _renderActive() {
        const { activeUserCount, alertContent } = this.state;
        return (
            <div className='d-flex flex-column align-items-center'>
                <div class='small'>Active users</div>
                <div>{activeUserCount}</div>
                <Button variant='primary' size='sm' onClick={this.handleShareClick}>Share and enjoy!</Button>
                <Alert variant='light' className='small'>{alertContent}</Alert>
            </div>
        );
    }

    _renderNormal() {
        return (
            <div>
                <small>
                    Note: Page will be reloaded with URL copied to clipboard.
                    Share and enjoy!
                </small>
            </div>
        );
    }
    render() {
        const { active } = this.props;
        return (
            <div>
                <div className='row justify-content-center' style={{
                    backgroundColor: 'rgb(160, 217, 198'
                }}>
                    Content
                </div>
                <div class='pt-2'>
                    {
                        active ? this._renderActive() : this._renderNormal()
                    }
                </div>
            </div>
        );
    }
}