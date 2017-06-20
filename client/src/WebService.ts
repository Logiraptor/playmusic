
export default class WebService {

    defaultInit: RequestInit

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

    get(path: string) {
        return fetch(path, this.defaultInit).then(resp => {
            return resp.json();
        })
    }

    post(path: string, data: {}) {
        return fetch(path, { ...this.defaultInit, method: 'POST', body: JSON.stringify(data) }).then(resp => {
            return resp.json();
        })
    }
}
