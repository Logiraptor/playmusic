
import WebService from './WebService';
import Song from './Song';

export class Speaker {
    name: string
    ip: string
    volume: number
}

export type Status = "STOPPED" | "PLAYING" | "PAUSED_PLAYBACK"

interface CurrentTrackInfo {
    RelTime: string;
    TrackMetaData: string;
    TrackDuration: string;
    current_transport_state: Status;
}

interface SongWithProgress extends Song {
    progress: string
    duration: string
    status: Status
}

function safeXMLGet(elem: Document, ns: string, type: string) {
    try {
        if (ns == "") {
            return elem.getElementsByTagName(type)[0].innerHTML;
        }
        return elem.getElementsByTagNameNS(ns, type)[0].innerHTML;
    } catch (e) {
        return ""
    }
}

export class SpeakerService extends WebService {
    async currentTrack(speaker: Speaker): Promise<SongWithProgress> {
        let track: CurrentTrackInfo = await this.post("/api/get_current_track_info", { ip: speaker.ip })
        console.log(track);
        let parser = new DOMParser()
        let metadata = parser.parseFromString(track.TrackMetaData, "text/xml")

        let song = new Song();
        song.title = safeXMLGet(metadata, "http://purl.org/dc/elements/1.1/", "title");
        song.artist = safeXMLGet(metadata, "http://purl.org/dc/elements/1.1/", "creator");
        song.album_art = safeXMLGet(metadata, "urn:schemas-upnp-org:metadata-1-0/upnp/", "albumArtURI");
        song.album = safeXMLGet(metadata, "urn:schemas-upnp-org:metadata-1-0/upnp/", "album");
        song.id = safeXMLGet(metadata, "http://purl.org/dc/elements/1.1/", "description");
        song.uri = safeXMLGet(metadata, "", "res");
        return {
            ...song,
            progress: track.RelTime,
            duration: track.TrackDuration,
            status: track.current_transport_state
        };
    }

    listSpeakers() {
        return this.get("/api/speakers")
    }

    async play(song: Song, speaker: Speaker) {
        let result = await this.post("/api/play_uri", { ...song, ip: speaker.ip })
        return result
    }

    async resume(speaker: Speaker) {
        return await this.post("/api/resume", { ip: speaker.ip })
    }

    async pause(speaker: Speaker) {
        return await this.post("/api/pause", { ip: speaker.ip })
    }

    volume(level: number, speaker: Speaker) {
        return this.post("/api/volume", { ip: speaker.ip, volume: level })
    }
}
