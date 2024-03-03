import { copyStateWithItems, IStateWithItems } from 'Controls/abstractListAspect';
import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
} from 'Controls/abstractSelectionAspect';

export interface IFlatSelectionState extends IAbstractSelectionState, IStateWithItems {}

export function copyFlatSelectionState(state: IFlatSelectionState): IFlatSelectionState {
    return {
        ...copyStateWithItems(state),
        ...copyAbstractSelectionState(state),
    };
}
