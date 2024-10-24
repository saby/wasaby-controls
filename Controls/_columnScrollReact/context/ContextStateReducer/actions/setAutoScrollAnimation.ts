import { TAutoScrollAnimation } from '../../../common/types';

export type TSetAutoScrollAnimationState = {
    autoScrollAnimation: TAutoScrollAnimation;
};

export type TSetAutoScrollAnimationAction = {
    type: 'setAutoScrollAnimation';
    value: TAutoScrollAnimation;
};

export function setAutoScrollAnimation<TState extends TSetAutoScrollAnimationState>(
    state: TState,
    action: TSetAutoScrollAnimationAction
): TState {
    return {
        ...state,
        autoScrollAnimation: action.value,
    };
}
