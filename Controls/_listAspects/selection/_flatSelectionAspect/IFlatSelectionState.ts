import {
    copyStateWithItems,
    IStateWithItems,
} from '../../_abstractListAspect/common/IStateWithItems';
import {
    copyAbstractSelectionState,
    IAbstractSelectionState,
} from '../_abstractSelectionAspect/IAbstractSelectionState';

export interface IFlatSelectionState extends IAbstractSelectionState, IStateWithItems {}

export function copyFlatSelectionState(state: IFlatSelectionState): IFlatSelectionState {
    return {
        ...copyStateWithItems(state),
        ...copyAbstractSelectionState(state),
    };
}
