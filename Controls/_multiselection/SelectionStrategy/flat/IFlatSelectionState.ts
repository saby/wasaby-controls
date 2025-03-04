import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
} from '../abstract/IAbstractSelectionState';
import type { IListState } from 'Controls-DataEnv/list';

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
