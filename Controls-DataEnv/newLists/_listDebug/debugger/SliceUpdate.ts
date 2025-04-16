import DurationTimer from './common/DurationTimer';
import { Session } from './Session';

export interface ISliceUpdateMeta {
    duration?: number;
}

export class SliceUpdate {
    private _session?: Session;
    private _sliceSetStateDurationTimer?: DurationTimer;
    private _meta: ISliceUpdateMeta = {};

    constructor(updateSession?: Session) {
        this._session = updateSession;
    }

    start(): this {
        this._meta = {};
        this._meta.duration = undefined;
        this._sliceSetStateDurationTimer = DurationTimer.start();
        this._session?.addSliceUpdate(this);
        return this;
    }

    end(): this {
        this._meta.duration = this._sliceSetStateDurationTimer?.stop();
        this._reset();
        return this;
    }

    getMeta(): ISliceUpdateMeta {
        return this._meta;
    }

    destroy() {
        this._reset();
    }

    private _reset() {
        if (this._sliceSetStateDurationTimer) {
            this._sliceSetStateDurationTimer?.destroy();
            this._sliceSetStateDurationTimer = undefined;
        }
        this._session = undefined;
    }
}
