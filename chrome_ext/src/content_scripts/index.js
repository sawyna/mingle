import ScriptInjector from './ScriptInjector';
import MingleClient from '../common/MingleClient';
import WindowHelpers from "../common/WindowHelpers";

let scriptEvents = () => {
    WindowHelpers.receive(['MINGLE_FORWARD', 'MINGLE_JOIN'], (msg) => {
        MingleClient.send(msg);
    });
}

MingleClient.receive((msg) => {
    WindowHelpers.send({
        action: 'MINGLE_RECEIVE',
        payload: msg,
    });
});

ScriptInjector.inject();
scriptEvents();
