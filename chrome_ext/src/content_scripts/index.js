import ScriptInjector from './ScriptInjector';
import MingleChannelNode from "../common/MingleChannelNode";
import WindowHelpers from "../common/WindowHelpers";

const MCSource = new MingleChannelNode('source', 'mingle-content', (msg) => {
    WindowHelpers.send({
        action: 'MINGLE_RECEIVE',
        payload: msg,
    });
});

let scriptEvents = () => {
    WindowHelpers.receive(['MINGLE_FORWARD', 'MINGLE_JOIN'], (msg) => {
        MCSource.send(msg);
    })
}

ScriptInjector.inject();
scriptEvents();
