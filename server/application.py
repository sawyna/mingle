import flask
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('client_send')
def handle_client_send(message):
    print('Received request from ', flask.request.sid)
    print('Received message ', message)
    payload = message['payload']
    channel_id = payload['channelId']
    emit('channel_sync', message, room=channel_id)

@socketio.on('client_join')
def handle_client_join(message):
    print('Client join: ', flask.request.sid)
    payload = message['payload']
    user_id = payload['userId']
    channel_id = payload['channelId']
    join_room(channel_id)
    print('User joined room', user_id, channel_id)

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    socketio.run(app)