"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TypeMoq = require("typemoq");
var chai_1 = require("chai");
var mobx_1 = require("mobx");
var Song = (function () {
    function Song() {
    }
    return Song;
}());
var PlayerState = (function () {
    function PlayerState() {
        this.songs = [];
    }
    return PlayerState;
}());
__decorate([
    mobx_1.observable
], PlayerState.prototype, "songs", void 0);
var Player = (function () {
    function Player(music) {
        this.music = music;
        this.state = new PlayerState();
    }
    Player.prototype.listSongs = function () {
        var _this = this;
        return this.music.listSongs().then(function (songs) {
            _this.state.songs = songs;
        });
    };
    return Player;
}());
describe('playing music', function () {
    var songs = [{ name: "Twinkle Twinkle Little Star", id: "1" }];
    it('shows the list of songs in the ui', function () {
        var musicService = TypeMoq.Mock.ofType();
        musicService.setup(function (x) { return x.listSongs(); }).returns(function () { return Promise.resolve(songs); });
        var player = new Player(musicService.object);
        return player.listSongs().then(function () {
            chai_1.expect(player.state.songs).to.deep.equal(songs);
        });
    });
});
