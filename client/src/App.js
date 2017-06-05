import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Service from './Service';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react'

class Store {
  constructor() {
    extendObservable(this, {
      songs: [],
      speakers: [],
      selectedIP: "",
      volume: 0,
      searchResults: {}
    })
  }
}

const store = new Store()

const App = observer(class extends Component {

  static defaultProps = {
    service: new Service(),
    store: store,
  }

  componentDidMount() {
    this.refreshData()
  }

  async refreshData() {
    this.props.store.songs = await this.props.service.listSongs()
    this.props.store.searchResults = await this.props.service.search("Kendrick Lamar")
    let speakers = await this.props.service.listSpeakers()

    this.props.store.speakers = speakers;
    this.props.store.selectedIP = speakers[0].ip;
    this.props.store.volume = speakers[0].volume;
  }

  render() {
    let songList = this.props.store.songs.map(song => {
      return (
        <div onClick={() => this.props.service.play(song.id, this.props.store.selectedIP)} style={{ display: "inline-block", padding: "10px" }}>
          <h3>{song.title}</h3>
          <img src={song.albumArtRef[0].url} alt={song.title} width="250" height="250" />
        </div>
      )
    })

    let speakerList = this.props.store.speakers.map(speaker => {
      return (
        <option value={speaker.ip}>{speaker.name}</option>
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
          <input type="range" min="0" max="100" value={this.props.store.volume} onChange={event => {
            this.props.service.volume(this.props.store.selectedIP, event.target.value)
            this.props.store.volume = parseInt(event.target.value, 10);
          }} />
        </p>
        <p className="App-intro">
          Play on:
          <select name="" id="" onChange={event => this.props.store.selectedIP = event.target.value}>
            {speakerList}
          </select>
        </p>
        <div>
          {JSON.stringify(this.props.store.searchResults, null, 4)}
        </div>
        <div>
          {songList}
        </div>
      </div >
    );
  }
})

export default App;
