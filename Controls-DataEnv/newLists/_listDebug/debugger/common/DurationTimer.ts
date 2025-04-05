export default class DurationTimer {
    private _start: number = 0;
    private _end: number = 0;

    start(): void {
        this._start = performance.now();
    }

    stop(): number {
        this._end = performance.now();
        return +(this._end - this._start).toFixed(2);
    }

    destroy() {
        this.stop();
    }

    static start(): DurationTimer {
        const timer = new DurationTimer();
        timer.start();
        return timer;
    }
}
