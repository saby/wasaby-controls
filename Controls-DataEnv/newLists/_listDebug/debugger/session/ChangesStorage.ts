import { DispatchesStorage } from './DispatchesStorage';
import type { Dispatch } from './Dispatch';
import { IChange as IBaseChange } from '../utils/getChanges';

export enum ChangeType {
    Inner = 'DispatcherInnerStateChange',
    Immediate = 'ImmediateSliceStateChange',
    User = 'SliceUserStateChange',
}

export type TChange = IBaseChange & {
    type: ChangeType;
    initiator?: Dispatch;
    phaseId?: string;
};

export type IChangesMeta = TChange[];

export class ChangesStorage {
    private _changes: TChange[] = [];

    private readonly _dispatchesStorage: DispatchesStorage;

    constructor(dispatchesStorage: DispatchesStorage) {
        this._dispatchesStorage = dispatchesStorage;
    }

    addChange(value: TChange): this {
        this._changes.push(value);
        this._dispatchesStorage.getCurrentDispatch()?.addChange(value);
        return this;
    }

    getMeta(): IChangesMeta {
        return this._changes;
    }

    destroy() {
        this._changes = [];
    }
}

export default ChangesStorage;
