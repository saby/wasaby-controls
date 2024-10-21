import { IColumnScrollContext } from '../../ColumnScrollContext';

export type TSetIsMobileScrollingState = {
    isMobileScrolling: boolean;
};

export type TSetIsMobileScrollingAction = {
    type: 'setIsMobileScrolling';
    value: IColumnScrollContext['isMobileScrolling'];
};

export function setIsMobileScrolling<TState extends TSetIsMobileScrollingState>(
    state: TState,
    action: TSetIsMobileScrollingAction
): TState {
    if (state.isMobileScrolling === action.value) {
        return state;
    }
    return {
        ...state,
        isMobileScrolling: action.value,
    };
}
