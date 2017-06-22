import * as React from 'react';
import './App.css';
import { Speaker, SpeakerService } from './SpeakerService';
import { MusicService } from './MusicService';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react'
import Song from './Song';
import { Player } from './Player';
import logo from './logo.svg';

class StatelessComponent<Props> extends React.Component<Props, void> { }

interface AppProps {
  player: Player
}

@observer
export default class App extends StatelessComponent<AppProps> {

  render() {
    let songList: JSX.Element[] = this.props.player.store.favorites.map((song, i) => {
      return (
        <SongRow key={i} song={song} onClick={() => this.props.player.play(song.id)} />
      )
    })

    let queueList: JSX.Element[] = this.props.player.store.queue.map((song, i) => {
      return (
        <SongRow key={i} song={song} onClick={() => this.props.player.playFromQueue(i)} />
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
          <MediaControls
            player={this.props.player} />
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
        <div className="panel scrollable">
          <h2>Queue</h2>
          {queueList}
        </div>
        <div className="panel wide scrollable">
          <h2>Favorites</h2>
          {songList}
        </div>
      </div>
    );
  }
}

@observer
class MediaControls extends StatelessComponent<{ player: Player }> {
  render() {
    let song = this.props.player.store.currentTrack;
    if (song) {

      let playPauseButton;

      if (this.props.player.store.status == "PLAYING") {
        playPauseButton = (
          <button onClick={() => this.props.player.setState("paused")}>Pause</button>
        )
      } else if (this.props.player.store.status == "PAUSED_PLAYBACK") {
        playPauseButton = (
          <button onClick={() => this.props.player.setState("playing")}>Play</button>
        )
      }

      return (
        <div>
          <img src={song.album_art} className="App-logo" alt="logo" />
          <h3>{song.artist} - {song.title} ({this.props.player.store.progress} / {this.props.player.store.duration})</h3>

          {playPauseButton}

        </div>
      )
    }
    return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Music</h3>
      </div>
    );
  }
}

@observer
class SongRow extends StatelessComponent<{ song: Song, onClick: () => void }> {
  render() {
    return (
      <div className="song-row" onClick={this.props.onClick}>
        <img src={this.props.song.album_art} alt={this.props.song.title} />
        <h3>{this.props.song.artist}</h3>
        <h3>{this.props.song.album}</h3>
        <h3>{this.props.song.title}</h3>
      </div>
    );
  }
}

@observer
class SongTile extends StatelessComponent<{ song: Song, onClick: () => void }> {
  render() {
    const song = this.props.song;
    return (
      <div style={{ display: "inline-block", padding: "10px" }}>
        <h3>{song.title} </h3>
        <img src={song.album_art} alt={song.title} width="250" height="250" />
      </div>
    )
  }
}