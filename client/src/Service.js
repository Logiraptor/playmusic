
export default class Service {

    constructor() {
        this.defaultInit = {
            method: 'GET',
            headers: {
                pragma: 'no-cache',
                "cache-control": 'no-cache',
                "content-type": "application/json",
            },
        };
    }

    get(path) {
        return fetch(path, this.defaultInit).then(resp => {
            return resp.json();
        })
    }

    post(path, data) {
        return fetch(path, { ...this.defaultInit, method: 'POST', body: JSON.stringify(data) }).then(resp => {
            return resp.json();
        })
    }

    listSongs() {
        return this.get("/api/list")
    }

    listSpeakers() {
        return this.get("/api/speakers")
    }

    play(songID, ip) {
        return this.post("/api/play", { songID, ip })
    }

    volume(ip, volume) {
        return this.post("/api/volume", { ip, volume })
    }

    search(query) {
        return this.post("/api/search", { query })
    }
}
