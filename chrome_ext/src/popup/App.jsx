import React from 'react';
import Util from '../common/Util';
import MingleContent from './MingleContent';
import MingleButton from './MingleButton';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMingleActive: false,
        };
    }

    componentDidMount() {
        Util.isMingleActiveExternal()
        .then((isMingleActive) => {
            this.setState({
                isMingleActive,
            });
        });
    }
    render() {
        const { isMingleActive } = this.state;
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
                <div
                    className="row justify-content-center"
                >
                    <MingleButton active={isMingleActive} />
                </div>
                <div>
                    <MingleContent active={isMingleActive} />
                </div>
            </div>
        );
    }
}