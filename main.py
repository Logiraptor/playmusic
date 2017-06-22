
import os
import json
import inspect
from gmusicapi import Mobileclient
from flask import Flask, jsonify, request
import soco
from soco.data_structures import DidlMusicTrack, DidlResource

APP = Flask(__name__)

MM = Mobileclient()
MM.login(
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

    return APP.route(route, methods=methods)(endpoint)


@auto
def list_songs():
    return MM.get_all_songs()


@auto
def list_stations():
    return MM.get_all_stations()


@auto
def speakers():
    return [{'ip': s.ip_address, 'name': s.player_name, 'volume': s.volume}
            for s in soco.discover()]


@auto
def play(songID, ip):
    stream_uri = MM.get_stream_url(songID)
    stream_uri = stream_uri.replace("https:", "x-rincon-mp3radio:")
    soco.SoCo(ip).play_uri(stream_uri)
    return {}


@auto
def get_stream_url(songID):
    stream_uri = MM.get_stream_url(songID)
    return stream_uri


@auto
def play_from_queue(ip, index):
    soco.SoCo(ip).play_from_queue(index)
    return {}


@auto
def play_uri(uri, duration, title, id, artist, album, album_art, ip):
    res = [DidlResource(uri=uri, duration=duration,
                        protocol_info="http-get:*:audio/mp3:*")]
    didl = DidlMusicTrack(title=title,
                          parent_id="DUMMY",
                          item_id=id,
                          resources=res,
                          creator=artist,
                          album=album,
                          album_art_uri=album_art,
                          description=id)

    device = soco.SoCo(ip)
    device.clear_queue()
    i = device.add_to_queue(didl) - 1
    device.play_from_queue(i)
    return [uri, title, id, artist, album, ip]


@auto
def get_queue(ip):
    return []


@auto
def get_current_track_info(ip):
    results = {}
    current_track = soco.SoCo(ip).avTransport.GetPositionInfo([
        ('InstanceID', 0),
        ('Channel', 'Master')
    ])
    results.update(current_track)

    speaker_state = soco.SoCo(ip).get_current_transport_info()
    results.update(speaker_state)

    return results


@auto
def pause(ip):
    soco.SoCo(ip).pause()
    return {}


@auto
def resume(ip):
    soco.SoCo(ip).play()
    return {}


@auto
def volume(volume, ip):
    zone = soco.SoCo(ip)
    zone.volume = int(volume)
    return {}


@auto
def search(query):
    return MM.search(query)


if __name__ == "__main__":
    APP.run()
