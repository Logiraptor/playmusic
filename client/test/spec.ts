
import * as TypeMoq from 'typemoq';
import { expect } from 'chai';
import * as React from 'react';
import { observable } from 'mobx';

class Song {
    name: string;
    id: string;
}

interface MusicService {
    listSongs(): Promise<Song[]>;
}

class PlayerState {
    @observable songs: Song[] = [];
}

class Player {
    constructor(private music: MusicService) { }

    state = new PlayerState();

    listSongs() {
        return this.music.listSongs().then(songs => {
            this.state.songs = songs;
        })
    }
}

interface Props {
    musicService: MusicService;
}

describe('playing music', () => {
    const songs: Song[] = [{ name: "Twinkle Twinkle Little Star", id: "1" }];

    it('shows the list of songs in the ui', () => {
        let musicService = TypeMoq.Mock.ofType<MusicService>();
        musicService.setup((x: MusicService) => x.listSongs()).returns(() => Promise.resolve(songs))

        let player = new Player(musicService.object);

        return player.listSongs().then(() => {
            expect(player.state.songs).to.deep.equal(songs);
        });
    });
});
