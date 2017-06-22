
import WebService from './WebService';
import Song from './Song';

export interface AlbumArtRef {
    kind: string;
    url: string;
}

export interface ArtistArtRef {
    aspectRatio: string;
    autogen: boolean;
    kind: string;
    url: string;
}

export interface PlayMusicSong {
    album: string;
    albumArtRef: AlbumArtRef[];
    albumArtist: string;
    albumId: string;
    artist: string;
    artistArtRef: ArtistArtRef[];
    artistId: string[];
    clientId: string;
    creationTimestamp: string;
    deleted: boolean;
    discNumber: number;
    durationMillis: string;
    estimatedSize: string;
    explicitType: string;
    id: string;
    kind: string;
    lastModifiedTimestamp: string;
    nid: string;
    recentTimestamp: string;
    storeId: string;
    title: string;
    trackNumber: number;
    trackType: string;
    year: number;
}

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

export class MusicService extends WebService {
    async listFavorites(): Promise<Song[]> {
        let songs: PlayMusicSong[] = await this.get("/api/list_songs")

        return songs.map(song => ({
            id: song.id,
            album: song.album,
            album_art: song.albumArtRef[0].url,
            artist: song.albumArtist,
            duration: millisToDuration(song.durationMillis),
            metadata: "",
            playlist_position: "",
            position: "",
            title: song.title,
            uri: "",
        }))
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
