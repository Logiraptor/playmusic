
import WebService from './WebService';
import Song from './Song';

export class Queue {
    queue: Song[];
    position: number;
}

export class QueueService extends WebService {
    async queue(): Promise<Queue> {
        return await this.get("/queue/list")
    }

    async enqueue(song: Song) {
        return await this.post("/queue/add", song)
    }

    async play(i: number) {
        return await this.post("/queue/play", { index: i })
    }
}
