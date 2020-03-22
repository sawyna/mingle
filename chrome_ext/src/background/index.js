import mingleClient from './mingleClient';
import mingleChannel from './mingleChannel';

chrome.runtime.onConnect.addListener((channel) => {
    if(channel.name === 'mingle-content') {
        ContentToClient(channel);
        ClientToContent(channel);
    }
 });


// from content channel to client
const ContentToClient = (channel) => {
     mingleChannel.listen(channel, (message) => {
         mingleClient.send(message);
     });
 }

 // from client to content channel
 const ClientToContent = (channel) => {
    mingleClient.receive((message) => {
        console.log('received from server ');
        console.log(message);
        mingleChannel.send(channel, message);
    });
};
