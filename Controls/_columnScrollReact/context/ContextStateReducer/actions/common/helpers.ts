import { isEdgeAnimated } from '../../../../common/helpers';
import { DebugLogger } from '../../../../common/DebugLogger';
import { EdgeState } from '../../../../common/types';
import { TState } from '../../../ContextStateReducer/TState';

/**
 * Состояние триггеров/границ области скроллирования.
 * @private
 */
interface IEdgesState {
    /**
     * Состояние левого триггера/левой границы области скроллирования.
     */
    left: EdgeState;
    /**
     * Состояние правого триггера/правой границы области скроллирования.
     */
    right: EdgeState;
}

/**
 * Метод мутации состояния границ области скроллирования на контексте.
 * @param {TState} oldState Старое состояние контекста.
 * @param {TState} newState Новое состояние контекста.
 * @param {IEdgesState} edges Новое состояние границ области скроллирования.
 */
export function updateEdgesStateMutable(oldState: TState, newState: TState, edges: IEdgesState) {
    if (oldState.leftEdgeState !== edges.left) {
        newState.leftEdgeState = edges.left;
    }
    if (oldState.rightEdgeState !== edges.right) {
        newState.rightEdgeState = edges.right;
    }
}

/**
 * Метод мутации состояния тригеров на контексте.
 * @param {TState} oldState Старое состояние контекста.
 * @param {TState} newState Новое состояние контекста.
 * @param {IEdgesState} triggers Новое состояние треггеров.
 */
export function updateTriggersStateMutable(
    oldState: TState,
    newState: TState,
    triggers: IEdgesState
): boolean {
    let isChanged = false;

    if (oldState.leftTriggerEdgeState !== triggers.left && !isEdgeAnimated(triggers.left)) {
        isChanged = true;
        newState.leftTriggerEdgeState = triggers.left;
    }

    if (oldState.rightTriggerEdgeState !== triggers.right && !isEdgeAnimated(triggers.right)) {
        isChanged = true;
        newState.rightTriggerEdgeState = triggers.right;
    }

    if (isChanged) {
        DebugLogger.bordersStateChanged(
            {
                left: oldState.leftTriggerEdgeState,
                right: oldState.rightTriggerEdgeState,
            },
            triggers,
            'triggers'
        );
    }

    return isChanged;
}
