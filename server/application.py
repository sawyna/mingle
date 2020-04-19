import logging
from logging.handlers import RotatingFileHandler
import platform
import sys

import flask
from flask import Flask
from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
file_handler = RotatingFileHandler('logs/app.log', maxBytes=50000000, backupCount=20)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter('[%(asctime)s]: %(message)s'))

logger = logging.getLogger()
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

socketio = SocketIO(app, cors_allowed_origins='*', logger=logger)



@socketio.on('client_send')
def handle_client_send(message):
    logger.info('Received request from %s', flask.request.sid)
    logger.info('Received message %s', message)
    channel_id = message.get('channelId') or message.get('payload', {}).get('channelId')
    emit('channel_sync', message, room=channel_id)

@socketio.on('client_join')
def handle_client_join(message):
    logger.info('Client joined')
    logger.info('Client join: %s', flask.request.sid)
    user_id = message['userId']

    # Handle old message format
    channel_id = message.get('channelId') or message.get('payload', {}).get('channelId')
    join_room(channel_id)
    logger.info('User joined room %s %s ', user_id, channel_id)

@app.route('/test')
def test():
    return 'yash'

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = False
    socketio.run(app, host='0.0.0.0')