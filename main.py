
import os
import json
import time
import inspect
import soco
from gmusicapi import Mobileclient
from flask import Flask, jsonify, request

app = Flask(__name__)

mm = Mobileclient()
mm.login(
    os.getenv('GOOGLE_EMAIL'),
    os.getenv('GOOGLE_PASSWORD'),
    Mobileclient.FROM_MAC_ADDRESS
)


def auto(f):
    spec = inspect.getargspec(f)
    route = "/api/{}".format(f.func_name)

    if spec.args:
        methods = ["POST"]
    else:
        methods = ["GET"]

    def endpoint():
        if spec.args:
            data = json.loads(request.data)
            values = [data[arg] for arg in spec.args]
            return jsonify(f(*values))
        else:
            return jsonify(f())

    endpoint.func_name = "{}endpoint".format(f.func_name)

    return app.route(route, methods=methods)(endpoint)


@auto
def list_songs():
    return mm.get_all_songs()


@auto
def list_stations():
    return mm.get_all_stations()


@auto
def speakers():
    return [{'ip': s.ip_address, 'name': s.player_name, 'volume': s.volume}
            for s in soco.discover()]


@auto
def play(songID, ip):
    stream_uri = mm.get_stream_url(songID)
    stream_uri = stream_uri.replace("https:", "x-rincon-mp3radio:")
    soco.SoCo(ip).play_uri(stream_uri)
    return {}


@auto
def get_stream_url(songID):
    stream_uri = mm.get_stream_url(songID)
    stream_uri = stream_uri.replace("https:", "x-rincon-mp3radio:")
    return stream_uri


@auto
def play_uri(uri, ip):
    soco.SoCo(ip).play_uri(uri)
    return {}


@auto
def get_queue(ip):
    return soco.SoCo(ip).get_queue()


@auto
def get_current_track_info(ip):
    return soco.SoCo(ip).get_current_track_info()


@auto
def volume(volume, ip):
    zone = soco.SoCo(ip)
    zone.volume = int(volume)
    return {}


@auto
def search(query):
    return mm.search(query)


if __name__ == "__main__":
    app.run()
