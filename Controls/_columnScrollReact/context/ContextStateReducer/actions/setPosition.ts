import { PrivateContextUserSymbol } from '../../ColumnScrollContext';
import {
    getEdgesStateAfterScroll,
    getLimitedPosition,
    getMaxScrollPosition,
} from '../../../common/helpers';
import { DebugLogger } from '../../../common/DebugLogger';
import { EdgeState } from '../../../common/types';
import { updateEdgesStateMutable, updateTriggersStateMutable } from './common/helpers';
import { TState } from '../TState';

export type TSetPositionAction = {
    type: 'setPosition';
    position: number;
    smooth?: boolean;
    privateContextUserSymbol?: typeof PrivateContextUserSymbol;
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
};

export function setPosition(state: TState, action: TSetPositionAction): TState {
    // Нет смысла устанавливать одну и ту же позицию.
    // Применимо только к публичному API, т.к. внутри библиотеки есть особенный механизм
    // трансформации для плавного подскрола.
    // В этом сценарии сначала устанавливаем позицию к которой скроллим, а состояние границам
    // устанавливаем в значение ...Animated..., после завершения анимации убираем это
    // состояние у границ. Также, нотификация о достижении границы происходит только
    // при втором вызове.
    if (
        state.position === action.position &&
        action.privateContextUserSymbol !== PrivateContextUserSymbol
    ) {
        return state;
    }

    const newState = { ...state };
    const newPosition = getLimitedPosition(action.position, state);

    // На мобильной платформе недоступна анимация через CSS трансформацию,
    // с помощью которой сделана плавная прокрутка(smooth) к позиции.
    // На мобильной платформе используется нативный механизм скроллирования.
    // Подробное описание в интерфейсе контекста IColumnScrollContext.mobileSmoothedScrollPosition.
    if (action.smooth && state.isMobile) {
        newState.mobileSmoothedScrollPosition = newPosition;
        return newState;
    } else {
        newState.mobileSmoothedScrollPosition = undefined;
    }

    const maxScrollPosition = getMaxScrollPosition(state);

    const newEdgesState = getEdgesStateAfterScroll(
        [0, maxScrollPosition],
        state.position,
        newPosition,
        action.smooth
    );

    DebugLogger.contextSetPositionCalled(
        state.position,
        newPosition,
        action.smooth,
        action.privateContextUserSymbol
    );

    newState.previousAppliedPosition = newState.position;
    newState.position = newPosition;

    action.onPositionChanged?.(newPosition);

    updateEdgesStateMutable(state, newState, newEdgesState);

    if (updateTriggersStateMutable(state, newState, newEdgesState) && action.onEdgesStateChanged) {
        action.onEdgesStateChanged(newState.leftTriggerEdgeState, newState.rightTriggerEdgeState);
    }

    return newState;
}
