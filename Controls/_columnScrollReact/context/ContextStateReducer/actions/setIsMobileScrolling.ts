import { IColumnScrollContext } from '../../ColumnScrollContext';
import { TState } from '../../ContextStateReducer/TState';

export type TSetIsMobileScrollingAction = {
    type: 'setIsMobileScrolling';
    value: IColumnScrollContext['isMobileScrolling'];
};

export function setIsMobileScrolling(state: TState, action: TSetIsMobileScrollingAction): TState {
    if (state.isMobileScrolling === action.value) {
        return state;
    }
    return {
        ...state,
        isMobileScrolling: action.value,
    };
}
