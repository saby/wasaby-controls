import { IColumnScrollContext } from '../../ColumnScrollContext';
import { TState } from '../TState';
import { EdgeState } from '../../../common/types';

export type TSetIsScrollbarDraggingAction = {
    type: 'setIsScrollbarDragging';
    value: IColumnScrollContext['isScrollbarDragging'];
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
};

export function setIsScrollbarDragging(
    state: TState,
    action: TSetIsScrollbarDraggingAction
): TState {
    if (state.isScrollbarDragging === action.value) {
        return state;
    }

    return {
        ...state,
        isScrollbarDragging: action.value,
    };
}
