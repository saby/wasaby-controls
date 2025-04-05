import { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import { TChange } from './ChangesStorage';
import DurationTimer from '../common/DurationTimer';
import * as ErrorDescriptors from '../../ErrorDescriptors';

export interface IDispatchMeta {
    /**
     * Распространяемое действие
     */
    action?: TAbstractAction;
    duration?: number;
    changes: TChange[];
    phaseId?: string;
}

export class Dispatch {
    private readonly _phaseId?: string;
    private _parent?: Dispatch;

    private _children: Dispatch[] = [];
    private _durationTimer?: DurationTimer;
    private _meta: IDispatchMeta;
    private _isStarted: boolean = false;

    constructor(parent?: Dispatch, phaseId?: string) {
        this._phaseId = phaseId;
        this._resetMeta();
        this._parent = parent;
        if (this._parent) {
            // Почему-то, ts тут не ругается и мне это нравится, я ему верю.
            // Вероятно, избыточно добавлять геттер и сеттер для себя же.
            this._parent._children.push(this);
        }
    }

    start(action: TAbstractAction) {
        if (this._isStarted) {
            throw ErrorDescriptors.DISPATCH_ALREADY_EXISTS();
        }
        this._isStarted = true;
        this._resetMeta();
        this._meta.action = action;
        this._durationTimer = DurationTimer.start();
    }

    end() {
        if (!this._isStarted) {
            throw ErrorDescriptors.MISSING_DISPATCH();
        }
        this._isStarted = false;
        if (this._durationTimer) {
            this._meta.duration = this._durationTimer.stop();
            this._durationTimer = undefined;
        }
    }

    getMeta(): IDispatchMeta {
        return this._meta;
    }

    getParent() {
        return this._parent;
    }

    getChildren() {
        return this._children;
    }

    addChange(change: TChange) {
        if (!this._isStarted) {
            throw ErrorDescriptors.MISSING_DISPATCH();
        }

        change.initiator = this;
        this._meta.changes.push(change);
    }

    destroy() {
        this._isStarted = false;
        this._resetMeta();
        if (this._durationTimer) {
            this._durationTimer?.stop();
            this._durationTimer = undefined;
        }
        this._parent = undefined;
        this._children.forEach((c) => {
            c.destroy();
        });
        this._children = [];
    }

    private _resetMeta() {
        this._meta = { changes: [], phaseId: this._phaseId };
    }
}
