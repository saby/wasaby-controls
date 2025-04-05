import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
    TAbstractSelectionSideData,
} from '../abstract/IAbstractSelectionState';
import type { IListState } from 'Controls-DataEnv/list';
import type { CollectionItem } from 'Controls/display';

export type TFlatSelectionSideData = TAbstractSelectionSideData<CollectionItem>;

export interface IFlatSelectionState
    extends IAbstractSelectionState,
        Pick<IListState, 'items' | 'keyProperty'> {}

export function copyFlatSelectionState({
    keyProperty,
    items,
    ...state
}: IFlatSelectionState): IFlatSelectionState {
    return {
        keyProperty,
        items,
        ...copyAbstractSelectionState(state),
    };
}
