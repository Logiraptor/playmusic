
import WebService from './WebService';

export class MusicService extends WebService {
    listFavorites() {
        return this.get("/api/list_songs")
    }

    listStations() {
        return this.get("/api/list_stations")
    }

    search(query: string) {
        return this.post("/api/search", { query })
    }

    getURI(songID: string) {
        return this.post("/api/get_stream_url", { songID })
    }
}
