import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import lodash from 'lodash-core';

import Util from '../common/Util';
import MingleContent from './MingleContent';
import MingleButton from './MingleButton';
import Constants from '../common/Constants';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMingleActive: false,
            isMingleEnabled: false,
        };

        this.handleHostClick = this.handleHostClick.bind(this);
    }

    componentDidMount() {
        Util.isMingleActiveExternal()
        .then((isMingleActive) => {
            this.setState({
                isMingleActive,
            });
        });

        Util.isMingleEnabledExternal()
        .then((isMingleEnabled) => {
            console.log('isMingleEnabled?');
            console.log(isMingleEnabled);
            this.setState({
                isMingleEnabled,
            });
        });
    }

    handleHostClick(hostname) {
        const url = Constants.MINGLE_ENABLED_SITES[hostname];

        if (lodash.isUndefined(url)) {
            return;
        }

        chrome.tabs.create({
            url: url,
        });

    }

    _renderDisabled() {
        return (
            <div className='row small'>
                <Card>
                    <Card.Header className='alert-danger'>
                        This platform is currently not supported
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Supported platforms</Card.Title>
                    </Card.Body>
                    <ListGroup>
                        {
                            Object.keys(Constants.MINGLE_ENABLED_SITES).map(hostname => {
                                return (
                                    <ListGroupItem action onClick={() => this.handleHostClick(hostname)}>{hostname}</ListGroupItem>
                                );
                            })
                        }
                    </ListGroup>
                </Card>
            </div>
        );
    }

    _renderMain() {
        const { isMingleActive, isMingleEnabled } = this.state;
        if (!isMingleEnabled) {
            return this._renderDisabled();
        }

        return (
            <React.Fragment>
                <div
                    className="row justify-content-center"
                >
                    <MingleButton active={isMingleActive} />
                </div>
                <div>
                    <MingleContent active={isMingleActive} />
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="container m-10">
                <div
                    className="row justify-content-center"
                    style={{
                        backgroundColor: 'rgb(39, 174, 137)',
                        color: 'white',
                    }}
                >
                    Mingle
                </div>
                {this._renderMain()}
            </div>
        );
    }
}