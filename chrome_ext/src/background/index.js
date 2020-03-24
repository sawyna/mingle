import MingleClient from './MingleClient';
import MingleChannelNode from '../common/MingleChannelNode';


const MCSink = new MingleChannelNode('sink', 'mingle-content', (msg) => {
    MingleClient.send(msg);
});

MingleClient.receive((msg) => {
    MCSink.send(msg);
});