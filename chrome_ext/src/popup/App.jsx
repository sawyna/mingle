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
            <div className="container">
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
    // render() {
    //     return (
    //         <div className="container"> b
    //             <div className="row justify-content-center">
    //                 <button className="btn">
    //                     <img src="images/turnoff_128.png" />
    //                 </button>
    //             </div>
    //             <div className="row justify-content-center">
    //                 <small>The page will be reloaded</small>
    //             </div>
    //             <div className="row justify-content-center">
    //                 Active users: 10
    //             </div>
    //             <div className="row justify-content-center">
    //                 Channel: mingle
    //             </div>
    //             <div className="row justify-content-center">
    //                 Share and enjoy! <i className="fas fa-copy"></i>
    //             </div>
    //         </div>
    //     );
    // }
}