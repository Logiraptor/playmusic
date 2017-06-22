
import WebService from './WebService';
import Song from './Song';
import { SearchResults, GMSearchResults, Track } from './Search'

function millisToDuration(millisString: string): string {
    const MS = 1
    const S = 1000 * MS
    const M = 60 * S
    const H = 60 * M
    let millis = parseInt(millisString);
    let hours = Math.floor(millis / H);
    millis -= (hours * H);
    let minutes = Math.floor(millis / M);
    millis -= (minutes * M);
    let seconds = Math.floor(millis / S)

    return hours + ":" + ('0' + minutes).slice(-2) + ":" + ('0' + seconds).slice(-2);
}

function trackToSong(track: Track): Song {
    return {
        id: track.id || track.storeId,
        album: track.album,
        album_art: track.albumArtRef[0].url,
        artist: track.albumArtist,
        duration: millisToDuration(track.durationMillis),
        metadata: "",
        playlist_position: "",
        position: "",
        title: track.title,
        uri: "",
    }
}

export class MusicService extends WebService {
    async listFavorites(): Promise<Song[]> {
        let songs: Track[] = await this.get("/api/list_songs")
        return songs.map(trackToSong)
    }

    listStations() {
        return this.get("/api/list_stations")
    }

    async search(query: string): Promise<SearchResults> {
        let results: GMSearchResults = await this.post("/api/search", { query })
        return {
            song_hits: results.song_hits.map(x => trackToSong(x.track))
        };
    }

    getURI(songID: string) {
        return this.post("/api/get_stream_url", { songID })
    }
}
