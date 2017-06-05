
import os
import json
import time
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


@app.route("/api/list")
def index():
    output = mm.get_all_songs()
    return jsonify(output)


@app.route("/api/speakers")
def speakers():
    output = [{'ip': s.ip_address, 'name': s.player_name, 'volume': s.volume}
              for s in soco.discover()]
    return jsonify(output)


@app.route("/api/play", methods=['POST'])
def play():
    data = json.loads(request.data)
    songID = data['songID']
    ip = data['ip']
    stream_uri = mm.get_stream_url(songID)
    stream_uri = stream_uri.replace("https:", "x-rincon-mp3radio:")
    soco.SoCo(ip).play_uri(stream_uri)
    return jsonify({})


@app.route("/api/volume", methods=['POST'])
def setVolume():
    volume = json.loads(request.data)['volume']
    ip = json.loads(request.data)['ip']
    zone = soco.SoCo(ip)
    zone.volume = int(volume)
    return jsonify({})


@app.route("/api/search", methods=['POST'])
def search():
    query = json.loads(request.data)['query']
    return jsonify(mm.search(query))


if __name__ == "__main__":
    app.run()
