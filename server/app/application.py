import os
import collections
import logging
from logging.handlers import RotatingFileHandler
import os
import platform
import sys

from app.analytics import GA
import flask
from flask import Flask, redirect, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit, join_room, leave_room, rooms

_SURVERY_URL = 'https://www.surveymonkey.com/r/732V586'

_GA_TRACKER = GA('UA-163387829-1')

app = Flask(__name__)
CORS(app, origins=['*'])
app.config['SECRET_KEY'] = 'secret!'
log_filename = 'logs/app.log'


try:
    os.makedirs(os.path.dirname(log_filename), exist_ok=True)
except:
    print("Error creating the log file. Please debug further")

file_handler = RotatingFileHandler(log_filename, maxBytes=50000000, backupCount=20)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter('[%(asctime)s]: %(message)s'))

logger = logging.getLogger()
logger.addHandler(file_handler)
logger.setLevel(logging.INFO)

socketio = SocketIO(app, cors_allowed_origins='*', logger=logger)

_ROOMS = collections.defaultdict(list)
_SID_TO_USERS = collections.defaultdict(dict)


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

    # In-memory cache
    _ROOMS[channel_id].append(flask.request.sid)
    _SID_TO_USERS[flask.request.sid][channel_id] = user_id
    logger.info('User joined room %s %s ', user_id, channel_id)


@socketio.on('disconnect')
def handle_disconnect():
    sid = flask.request.sid
    logger.info('Received disconnect for sid %s and users %s', sid, _SID_TO_USERS.get(sid))
    _cleanup_local_cache(sid)


def _cleanup_local_cache(sid):
    # Server restart/some anomaly
    if sid not in _SID_TO_USERS:
        return
        
    for channel_id, user_id in _SID_TO_USERS[sid].iteritems():
        if not channel_id:
            return
        
        current_room = _ROOMS[channel_id]
        if sid in current_room:
            current_room.remove(sid)
        
        if len(current_room) == 0:
            del _ROOMS[channel_id]
    
    del _SID_TO_USERS[sid]



@app.route('/test')
def test():
    logger.info('request params %s', request.args)
    cid = request.args.get('cid')
    _GA_TRACKER.event('test', 'test_action', headers={
        'User-Agent': request.headers.get('User-Agent'),
    }, cid=cid, ip_address=request.remote_addr)
    return 'yash'


@app.route('/channel/<channel_id>/count')
def get_channel_user_count(channel_id):
    logger.info('users in current channel %s', _ROOMS[channel_id])
    return str(len(_ROOMS[channel_id]))


@app.route('/uninstall')
def uninstall_app():
    logger.info('Received uninstall request. Redirecting to survey monkey')
    cid = request.args.get('cid')
    is_dev = request.args.get('dev')
    is_dev = True if is_dev == '1' else False

    if not is_dev:
        _GA_TRACKER.event('INSTALL', event_action='uninstall', headers={
            'User-Agent': request.headers.get('User-Agent'),
        }, cid=cid, ip_address=request.remote_addr)
    return redirect(_SURVERY_URL)


# run the app.
if __name__ == "__main__":
    debug = os.getenv('MINGLE_DEBUG', 'True')
    debug = bool(debug)
    app.debug = debug
    socketio.run(app, host='0.0.0.0')