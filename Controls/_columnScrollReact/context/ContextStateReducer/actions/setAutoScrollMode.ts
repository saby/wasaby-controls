import { TState } from '../TState';
import { TAutoScrollMode } from '../../../common/types';

export type TSetAutoScrollModeAction = { type: 'setAutoScrollMode'; value: TAutoScrollMode };

export function setAutoScrollMode(state: TState, action: TSetAutoScrollModeAction): TState {
    return {
        ...state,
        autoScrollMode: action.value,
    };
}