import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert';
import lodash from 'lodash-core';

import Util from '../common/Util';

export default class MingleContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUserCount: '1',
            tab: null,
            showAlertContent: false,
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
            if (lodash.isEmpty(result)) {
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
                showAlertContent: true,
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
        const { activeUserCount, alertContent, showAlertContent } = this.state;
        return (
            <div className='d-flex flex-column align-items-center'>
                <div class='small'>Active users</div>
                <div class='strong'>{activeUserCount}</div>
                <div class='small'>Play/pause/seek to sync</div>
                <br />
                <OverlayTrigger
                    key='bottom'
                    placement='bottom'
                    overlay={
                    <Tooltip id={`popover-positioned-bottom`}>
                        <Tooltip.Content>
                            {alertContent}
                        </Tooltip.Content>
                    </Tooltip>
                    }
                >
                    <Button variant='primary' size='sm' onClick={this.handleShareClick}>Share and enjoy!</Button>
                </OverlayTrigger>
                {showAlertContent && (<Alert variant='light' size='sm'>{alertContent}</Alert>)}
            </div>
        );
    }

    _renderNormal() {
        return (
            <div className='justify-content-center'>
                <div>
                    <small className='font-italic'>
                        - Open a video
                    </small>
                </div>
                <div>
                    <small className='font-italic'>
                        - Click the above button to create a channel
                    </small>
                </div>
                <div>
                    <small className='font-italic'>
                        - URL will be copied to clipboard
                    </small>
                </div>
                <div>
                    <small className='font-italic'>
                        - Share and enjoy!
                    </small>
                </div>
            </div>
        );
    }
    render() {
        const { active } = this.props;
        return (
            <div>
                <div className='row justify-content-center' style={{
                    backgroundColor: 'rgb(160, 217, 198)',
                    color: 'rgb(160, 217, 198)',
                    fontSize: '8px',
                }}>
                    Content
                </div>
                <div className='pt-2'>
                    {
                        active ? this._renderActive() : this._renderNormal()
                    }
                </div>
            </div>
        );
    }
}