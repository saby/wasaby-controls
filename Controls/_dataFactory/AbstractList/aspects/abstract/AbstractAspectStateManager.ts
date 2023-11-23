import type { Collection as ICollection } from 'Controls/display';
import type { Tree as ITreeCollection } from 'Controls/baseTree';
import type { IListChange } from '../../_interface/IListChanges';

type IAbstractCollection = ICollection | ITreeCollection;

export abstract class AbstractAspectStateManager<
    TState,
    TCollection extends IAbstractCollection = ICollection
> {
    abstract resolveChanges(prevState: Partial<TState>, nextState: Partial<TState>): IListChange[];

    abstract getNextState(state: TState, changes: IListChange[]): TState;

    abstract applyChangesToCollection(collection: TCollection, changes: IListChange[]): void;
}
