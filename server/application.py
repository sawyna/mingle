import flask
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('client_send')
def handle_client_send(message):
    print 'Received request from %s' % flask.request.sid
    print 'Received message %s' % message
    channel_id = message['channelId']
    emit('channel_sync', message, room=channel_id)

@socketio.on('client_join')
def handle_client_join(message):
    print 'Client join: %s' % flask.request.sid
    user_id = message['userId']

    # Handle old message format
    channel_id = message.get('channelId') or message.get('payload', {}).get('channelId')
    join_room(channel_id)
    print 'User joined room %s %s ' % (user_id, channel_id)

@app.route('/test')
def test():
    return 'yash'

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    socketio.run(app, host='0.0.0.0')