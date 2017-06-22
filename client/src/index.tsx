import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Player } from './Player';
import { SpeakerService } from './SpeakerService';
import { MusicService } from './MusicService';
import { QueueService } from './QueueService';
// import './index.css';

let container = document.createElement('div');
document.body.appendChild(container);

const speakers = new SpeakerService();
const music = new MusicService()
const queue = new QueueService()
const player = new Player(speakers, music, queue)
player.refresh()


ReactDOM.render(<App player={player} />, container);
