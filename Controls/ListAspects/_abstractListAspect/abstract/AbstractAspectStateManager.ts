import type { Collection as ICollection } from 'Controls/display';
import type { Tree as ITreeCollection } from 'Controls/baseTree';
import type { IListChange } from '../common/ListChanges';

type IAbstractCollection = ICollection | ITreeCollection;

export type TAbstractAspectStateManagerProps = {};

export abstract class AbstractAspectStateManager<
    TState,
    TCollection extends IAbstractCollection = ICollection
> {
    constructor({}: TAbstractAspectStateManagerProps = {}) {}

    abstract resolveChanges(prevState: Partial<TState>, nextState: Partial<TState>): IListChange[];

    abstract getNextState(state: TState, changes: IListChange[]): TState;

    abstract applyChangesToCollection(collection: TCollection, changes: IListChange[]): void;
}
