import * as React from 'react';
import './App.css';
import { Speaker, SpeakerService } from './SpeakerService';
import { MusicService } from './MusicService';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react'
import * as logo from './logo.svg';

class Song {
  id: string
  title: string
  albumArtRef: { url: string }[]
}


class Store {
  @observable favorites: Song[] = []
  @observable speakers: Speaker[] = []
  @observable selectedIP: string = ""
  @observable volume: number = 0
  @observable searchResults: {} = {}
  @observable currentTrack: {} = {}

  @computed get selectedSpeaker(): Speaker {
    return this.speakers.filter(x => x.ip == this.selectedIP)[0]
  }
}

class Player {
  store: Store = new Store();

  constructor(private speakers: SpeakerService, private music: MusicService) {
    setInterval(async () => {
      if (this.store.selectedIP) {
        this.store.currentTrack = await this.speakers.currentTrack(this.store.selectedSpeaker)
      }
    }, 1000)
  }

  async refresh() {
    this.store.favorites = await this.music.listFavorites()
    this.store.searchResults = await this.music.search("Kendrick Lamar")
    let speakers = await this.speakers.listSpeakers()

    this.store.speakers = speakers;
    this.store.selectedIP = speakers[0].ip;
    this.store.volume = speakers[0].volume;
  }

  async play(id: string) {
    let uri = await this.music.getURI(id);
    return this.speakers.playURI(uri, this.store.selectedSpeaker);
  }

  volume(level: number) {
    this.speakers.volume(level, this.store.selectedSpeaker)
    this.store.volume = level;
  }
}

const speakers = new SpeakerService();
const music = new MusicService()
const player = new Player(speakers, music)
player.refresh()


interface AppProps {
  player?: Player
}

@observer
export default class App extends React.Component<AppProps, {}> {

  static defaultProps: Partial<AppProps> = {
    player: player
  }

  render(): JSX.Element {
    let songList: JSX.Element[] = this.props.player.store.favorites.map(song => {
      return (
        <SongTile song={song} player={this.props.player} />
      )
    })

    let speakerList = this.props.player.store.speakers.map(speaker => {
      return (
        <option key={speaker.ip} value={speaker.ip}> {speaker.name} </option>
      )
    })

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Sonos Controller</h2>
        </div>
        <p>
          Volume:
          <input
            type="range"
            min="0"
            max="100"
            value={this.props.player.store.volume}
            onChange={event => {
              this.props.player.volume(parseInt(event.target.value))
            }
            } />
        </p>
        <p className="App-intro">
          Play on:
          <select name="" id="" onChange={event => this.props.player.store.selectedIP = event.target.value}>
            {speakerList}
          </select>
        </p>
        <div>
          {JSON.stringify(this.props.player.store.currentTrack)}
        </div>
        <div>
          {songList}
        </div>
      </div>
    );
  }
}

@observer
class SongTile extends React.Component<{ song: Song, player: Player }, {}> {
  render(): JSX.Element {
    const song = this.props.song;
    return (
      <div
        onClick={() => this.props.player.play(song.id)}
        style={{ display: "inline-block", padding: "10px" }}
      >
        <h3>{song.title} </h3>
        < img src={song.albumArtRef[0].url} alt={song.title} width="250" height="250" />
      </div>
    )
  }
}