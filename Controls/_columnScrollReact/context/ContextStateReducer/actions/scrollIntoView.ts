import { TState } from '../TState';
import { EdgeState, TScrollIntoViewAlign } from '../../../common/types';
import { calcTargetPositionWithAlign, getAutoScrollTargetParams } from '../../../common/helpers';
import { PrivateContextUserSymbol } from '../../ColumnScrollContext';
import { setPosition } from './setPosition';

export type TScrollIntoViewAction = {
    type: 'scrollIntoView';
    privateContextUserSymbol?: typeof PrivateContextUserSymbol;
    target: HTMLElement | number;
    align: TScrollIntoViewAlign;
    smooth?: boolean;
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
};

export function scrollIntoView(state: TState, action: TScrollIntoViewAction): TState {
    let target: HTMLElement;
    let align: TScrollIntoViewAlign;

    if (typeof action.target === 'number') {
        const autoScrollParams = getAutoScrollTargetParams(
            state.SELECTORS.AUTOSCROLL_TARGET,
            state.SELECTORS.ROOT_TRANSFORMED_ELEMENT,
            state.position === action.target ? state.previousAppliedPosition : state.position,
            action.target,
            state
        );
        if (!autoScrollParams) {
            return state;
        }
        target = autoScrollParams.target;
        align = autoScrollParams.align;
    } else {
        target = action.target;
        align = action.align;
    }

    const rootRect = target
        .closest(`.${state.SELECTORS.ROOT_TRANSFORMED_ELEMENT}`)
        .getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const newPosition = calcTargetPositionWithAlign(
        rootRect,
        targetRect,
        state.position,
        state,
        align
    );

    return setPosition(state, {
        type: 'setPosition',
        privateContextUserSymbol: action.privateContextUserSymbol,
        smooth: action.smooth,
        position: newPosition,
        onEdgesStateChanged: action.onEdgesStateChanged,
        onPositionChanged: action.onPositionChanged,
    });
}
