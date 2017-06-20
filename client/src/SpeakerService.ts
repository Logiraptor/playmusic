
import WebService from './WebService';

export class Speaker {
    name: string
    ip: string
    volume: number
}

export class SpeakerService extends WebService {
    currentTrack(speaker: Speaker) {
        return this.post("/api/get_current_track_info", { ip: speaker.ip })
    }

    listSpeakers() {
        return this.get("/api/speakers")
    }

    playURI(uri: string, speaker: Speaker) {
        return this.post("/api/play_uri", { uri, ip: speaker.ip })
    }

    volume(level: number, speaker: Speaker) {
        return this.post("/api/volume", { ip: speaker.ip, volume: level })
    }
}
