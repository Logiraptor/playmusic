package main

import (
	"encoding/json"
	"os"
	"sync"
)

type Song struct {
	ID               string `json:"id"`
	Album            string `json:"album"`
	AlbumArt         string `json:"album_art"`
	Artist           string `json:"artist"`
	Duration         string `json:"duration"`
	Metadata         string `json:"metadata"`
	PlaylistPosition string `json:"playlist_position"`
	Position         string `json:"position"`
	Title            string `json:"title"`
	URI              string `json:"uri"`
}

type AppState struct {
	Queue    []Song `json:"queue"`
	Position int    `json:"position"`
}

func writeToFile(filename string, state AppState) error {
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	buf, err := json.MarshalIndent(state, "", "\t")
	if err != nil {
		return err
	}
	_, err = f.Write(buf)
	return err
}

func readFromFile(filename string) (AppState, error) {
	f, err := os.Open(filename)
	if os.IsNotExist(err) {
		return AppState{Queue: []Song{}, Position: -1}, nil
	}
	if err != nil {
		return AppState{}, err
	}
	defer f.Close()
	dec := json.NewDecoder(f)
	var state AppState
	err = dec.Decode(&state)
	if err != nil {
		return state, err
	}
	return state, nil
}

var globalLock sync.Mutex

func withState(f func(*AppState) error) error {
	const filename = "state.json"

	globalLock.Lock()
	defer globalLock.Unlock()
	state, err := readFromFile(filename)
	if err != nil {
		return err
	}
	err = f(&state)
	if err != nil {
		return err
	}
	err = writeToFile(filename, state)
	if err != nil {
		return err
	}
	return nil
}
