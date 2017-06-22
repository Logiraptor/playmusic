
import Song from './Song'
import { MusicService } from './MusicService';
import { Speaker, SpeakerService, Status } from './SpeakerService';
import { QueueService } from './QueueService';
import { observable, computed } from 'mobx'
import { SearchResults } from './Search';


class Map<T> {
    private data: { [id: string]: T } = {};

    add(key: string, value: T) {
        this.data[key] = value;
    }

    find(key: string): T {
        return this.data[key]
    }

    findWhere(cond: (elem: T) => boolean): T[] {
        let matchingKeys = Object.keys(this.data).filter(key => cond(this.data[key]));
        return matchingKeys.map(x => this.find(x))
    }

    map<V>(f: (elem: T) => V): V[] {
        return Object.keys(this.data).map(x => f(this.data[x]))
    }
}


export class Store {

    @observable songs: Map<Song> = new Map<Song>();
    @observable queueIds: string[] = []
    @observable favoriteIds: string[] = []
    @observable searchResultSongIds: string[] = []

    @observable status: Status
    @observable speakers: Speaker[] = []
    @observable selectedIP: string = ""
    @observable volume: number = 0
    @observable queuePosition: number = -1;
    @observable progress: string = ""
    @observable duration: string = ""

    @observable currentTrack?: Song

    addSongs(songs: Song[]): string[] {
        return songs.map(song => {
            if (this.songs.find(song.id) !== undefined) {
                return song.id;
            }
            this.songs.add(song.id, song);
            return song.id;
        })
    }

    @computed get queue(): Song[] {
        return this.queueIds.map(id => this.songs.find(id))
    }

    @computed get favorites(): Song[] {
        return this.favoriteIds.map(id => this.songs.find(id))
    }

    @computed get searchResults(): SearchResults {
        return {
            song_hits: this.searchResultSongIds.map(id => this.songs.find(id))
        }
    }

    @computed get selectedSpeaker(): Speaker {
        return this.speakers.filter(x => x.ip == this.selectedIP)[0]
    }
}

export class Player {
    store: Store = new Store();

    constructor(private speakers: SpeakerService, private music: MusicService, private queue: QueueService) {
        const loadCurrentTrack = async () => {
            if (this.store.selectedIP) {
                let queue = await this.queue.queue()
                this.store.queueIds = this.store.addSongs(queue.queue)
                const currentTrack = await this.speakers.currentTrack(this.store.selectedSpeaker)

                this.store.progress = currentTrack.progress;
                this.store.duration = currentTrack.duration;
                this.store.status = currentTrack.status;
                this.store.queuePosition = queue.position;

                if (currentTrack.status == "STOPPED" &&
                    this.store.queueIds.length > queue.position + 1) {
                    await this.playFromQueue(queue.position + 1)
                } else {
                    if (currentTrack.id) {
                        this.store.currentTrack = this.store.songs.findWhere(x => x.id === currentTrack.id)[0]
                    } else {
                        this.store.currentTrack = currentTrack;
                    }
                }
            }
            setTimeout(loadCurrentTrack, 1000)
        }
        setTimeout(loadCurrentTrack, 1000)
    }

    async refresh() {
        this.store.favoriteIds = this.store.addSongs(await this.music.listFavorites())
        let speakers = await this.speakers.listSpeakers()

        let queue = await this.queue.queue()
        this.store.queueIds = this.store.addSongs(queue.queue)

        this.store.speakers = speakers
        this.store.selectedIP = speakers[0].ip
        this.store.volume = speakers[0].volume
    }

    async play(id: string) {
        let song = this.store.songs.find(id);
        await this.queue.enqueue(song);
        this.store.queueIds.push(id);
    }

    async playFromQueue(i: number) {
        let selectedID = this.store.queueIds[i];
        let song = this.store.songs.find(selectedID);
        song.uri = await this.music.getURI(selectedID);
        await this.queue.play(i);
        return await this.speakers.play(song, this.store.selectedSpeaker);
    }

    async clearQueue() {
        return await this.queue.clear()
    }

    async search(query: string) {
        this.store.searchResultSongIds = this.store.addSongs((await this.music.search(query)).song_hits);
    }

    async setState(state: "playing" | "paused") {
        switch (state) {
            case "playing":
                return await this.speakers.resume(this.store.selectedSpeaker)
            case "paused":
                return await this.speakers.pause(this.store.selectedSpeaker)
        }
    }

    volume(level: number) {
        this.speakers.volume(level, this.store.selectedSpeaker)
        this.store.volume = level;
    }
}