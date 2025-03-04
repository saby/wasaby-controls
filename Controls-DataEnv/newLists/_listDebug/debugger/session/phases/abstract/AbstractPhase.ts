import DurationTimer from '../../../common/DurationTimer';
import { IPhase, IPhaseMeta, TInferBefore, TInferAfter } from './IPhase';
import * as ErrorDescriptors from '../../../../ErrorDescriptors';

export { IPhaseMeta, TInferBefore, TInferAfter };

export abstract class AbstractPhase<TMeta extends IPhaseMeta<unknown, unknown>>
    implements IPhase<TMeta>
{
    abstract readonly id: string;
    abstract readonly description: string;
    private readonly _onEndCallback?: (meta: TMeta) => void;

    private _sessionDurationTimer?: DurationTimer;
    private _meta: TMeta;

    private _isStarted: boolean = false;
    private _isCompleted: boolean = false;

    constructor(onEndCallback?: (meta: TMeta) => void) {
        this._onEndCallback = onEndCallback;
        this._resetMeta();
    }

    isStarted(): boolean {
        return this._isStarted;
    }

    isCompleted(): boolean {
        return this._isCompleted;
    }

    start(meta: TInferBefore<TMeta>): void {
        if (this._isStarted) {
            throw ErrorDescriptors.PHASE_HAS_BEEN_ALREADY_STARTED(this.id);
        }
        this._isCompleted = false;
        this._isStarted = true;
        this._resetMeta();
        this._meta.beforeMeta = meta;
        this._sessionDurationTimer = DurationTimer.start();
    }

    end(meta: TInferAfter<TMeta>): void {
        if (!this._isStarted) {
            throw ErrorDescriptors.PHASE_HAS_NOT_BEEN_STARTED(this.id);
        }
        this._isCompleted = true;
        this._isStarted = false;
        this._meta.duration = this._sessionDurationTimer?.stop();
        this._meta.afterMeta = meta;
        this._onEndCallback?.(this.getMeta());
    }

    getMeta(): TMeta {
        return this._meta;
    }

    destroy(): void {
        this._isStarted = false;
        this._resetMeta();
        if (this._sessionDurationTimer) {
            this._sessionDurationTimer.destroy();
            this._sessionDurationTimer = undefined;
        }
    }

    private _resetMeta() {
        this._meta = { id: this.id } as TMeta;
    }
}
