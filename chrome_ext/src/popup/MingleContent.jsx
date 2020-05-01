import React from 'react';
import lodash from 'lodash-core';

import Util from '../common/Util';

export default class MingleActive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUserCount: '1',
            tab: null,
        }
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

    componentDidMount() {
        Util.getCurrentTab().then(tab => {
            console.log(tab);
            this.setState({ tab }, () => {
                this.handleActiveUserCount();
            });
        });
    }

    _renderActive() {
        const { activeUserCount } = this.state;
        return (
            <div className='d-flex flex-column align-items-center'>
                <div class='small'>Active users</div>
                <div>{activeUserCount}</div>
                <button
                    class='btn btn-sm btn-primary'
                    data-container='body'
                    data-toggle='popover'
                    data-placement='bottom'
                    data-content='Copy to clipboard'
                >
                    Share and enjoy!
                </button>
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