import { TAutoScrollMode } from '../../../common/types';

export type TSetAutoScrollModeState = {
    autoScrollMode: TAutoScrollMode;
};

export type TSetAutoScrollModeAction = {
    type: 'setAutoScrollMode';
    value: TAutoScrollMode;
};

export function setAutoScrollMode<TState extends TSetAutoScrollModeState>(
    state: TState,
    action: TSetAutoScrollModeAction
): TState {
    return {
        ...state,
        autoScrollMode: action.value,
    };
}
