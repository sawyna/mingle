import React from 'react';

export default class App extends React.Component {
    render() {
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
                <div className="row justify-content-center">
                    <button className="btn">
                        <img src="images/turnoff_128.png" />
                    </button>
                </div>
                <div className="row justify-content-center">
                    <small>The page will be reloaded</small>
                </div>
                <div className="row justify-content-center">
                    Active users: 10
                </div>
                <div className="row justify-content-center">
                    Channel: mingle
                </div>
                <div className="row justify-content-center">
                    Share and enjoy! <i className="fas fa-copy"></i>
                </div>
            </div>
        );
    }
}