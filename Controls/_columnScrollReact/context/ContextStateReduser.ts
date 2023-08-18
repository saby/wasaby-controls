import { IColumnScrollContext, PrivateContextUserSymbol } from './ColumnScrollContext';
import {
    getEdgesState,
    getEdgesStateAfterScroll,
    getLimitedPosition,
    getMaxScrollPosition,
    isEdgeAnimated,
} from '../common/helpers';
import { DebugLogger } from '../common/DebugLogger';
import { EdgeState } from '../common/types';
import { IColumnScrollWidths } from '../common/interfaces';
import { Logger } from 'UICommon/Utils';

interface IEdgesState {
    left: EdgeState;
    right: EdgeState;
}

type TState = Pick<
    IColumnScrollContext,
    | 'isMobileScrolling'
    | 'position'
    | 'viewPortWidth'
    | 'contentWidth'
    | 'startFixedWidth'
    | 'endFixedWidth'
    | 'isMobile'
    | 'isScrollbarDragging'
    | 'mobileSmoothedScrollPosition'
    | 'leftEdgeState'
    | 'rightEdgeState'
    | 'isNeedByWidth'
> & {
    leftTriggerEdgeState: EdgeState;
    rightTriggerEdgeState: EdgeState;
    columnScrollStartPosition: number | 'end';
};

function updateEdgesStateMutable(oldState: TState, newState: TState, edges: IEdgesState) {
    let isChanged = false;

    if (oldState.leftEdgeState !== edges.left) {
        newState.leftEdgeState = edges.left;
        isChanged = true;
    }
    if (oldState.rightEdgeState !== edges.right) {
        newState.rightEdgeState = edges.right;
        isChanged = true;
    }

    if (isChanged) {
        DebugLogger.bordersStateChanged(
            {
                left: oldState.leftEdgeState,
                right: oldState.rightEdgeState,
            },
            edges,
            'edges'
        );
    }
}

function updateTriggersStateMutable(
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

function contextReducer(
    state: TState,
    action:
        | { type: 'setIsMobileScrolling'; value: IColumnScrollContext['isMobileScrolling'] }
        | { type: 'setIsScrollbarDragging'; value: IColumnScrollContext['isScrollbarDragging'] }
        | {
              type: 'setPositionFromAPI';
              position: number;
              smooth?: boolean;
              privateContextUserSymbol?: typeof PrivateContextUserSymbol;
              onPositionChanged?: (position: number) => void;
              onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
          }
        | {
              type: 'updateSizes';
              privateContextUserSymbol: typeof PrivateContextUserSymbol;
              widths: Partial<IColumnScrollWidths>;
              onPositionChanged?: (position: number) => void;
              onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
          }
        | {
              type: 'enrichSizes';
              viewPortWidth?: number;
              startFixedWidth?: number;
              endFixedWidth?: number;
              scrollableWidth?: number;
              enrichedCallback: (widths: IColumnScrollWidths) => void;
          }
) {
    switch (action.type) {
        case 'setIsMobileScrolling': {
            if (state.isMobileScrolling === action.value) {
                return state;
            }
            return {
                ...state,
                isMobileScrolling: action.value,
            };
        }
        case 'setIsScrollbarDragging': {
            if (state.isScrollbarDragging === action.value) {
                return state;
            }
            return {
                ...state,
                isScrollbarDragging: action.value,
            };
        }
        case 'setPositionFromAPI': {
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
            newState.position = newPosition;

            action.onPositionChanged?.(newPosition);

            updateEdgesStateMutable(state, newState, newEdgesState);

            if (
                updateTriggersStateMutable(state, newState, newEdgesState) &&
                action.onEdgesStateChanged
            ) {
                action.onEdgesStateChanged(
                    newState.leftTriggerEdgeState,
                    newState.rightTriggerEdgeState
                );
            }

            return newState;
        }
        case 'enrichSizes': {
            const viewPortWidth = action.viewPortWidth || state.viewPortWidth;

            let startFixedWidth: number;
            let endFixedWidth: number;
            let scrollableWidth: number;

            if (
                typeof action.startFixedWidth !== 'undefined' ||
                typeof action.endFixedWidth !== 'undefined'
            ) {
                // Изменились обе фиксированные части, от них можно посчитать размеры в любом случае.
                if (
                    typeof action.startFixedWidth !== 'undefined' &&
                    typeof action.endFixedWidth !== 'undefined'
                ) {
                    // Размер скроллируемого контента тоже поменялся, обновим всё.
                    if (typeof action.scrollableWidth !== 'undefined') {
                        // Все ширины есть
                        startFixedWidth = action.startFixedWidth;
                        endFixedWidth = action.endFixedWidth;
                        scrollableWidth = action.scrollableWidth;
                    } else {
                        // Размер скроллируемого контента не изменился, высчитаем его с изменнеными ширинами.
                        startFixedWidth = action.startFixedWidth;
                        endFixedWidth = action.endFixedWidth;
                        scrollableWidth =
                            state.contentWidth - action.startFixedWidth - action.endFixedWidth;
                    }
                } else if (typeof action.startFixedWidth !== 'undefined') {
                    // Поменялись размеры фиксированной в начале части.
                    // Может быть поменялся скроллируемый контент, прочекаем это.
                    startFixedWidth = action.startFixedWidth;
                    endFixedWidth = state.endFixedWidth;
                    scrollableWidth =
                        action.scrollableWidth ||
                        state.contentWidth - startFixedWidth - endFixedWidth;
                } else {
                    // Поменялись размеры фиксированной в конце части.
                    // Может быть поменялся скроллируемый контент, прочекаем это.
                    startFixedWidth = state.startFixedWidth;
                    endFixedWidth = action.endFixedWidth;
                    scrollableWidth =
                        action.scrollableWidth ||
                        state.contentWidth - startFixedWidth - endFixedWidth;
                }
            } else {
                // Фиксированные размеры не поменялись, но поменялся скроллируемый контент.
                // Может быть поменялся скроллируемый контент, прочекаем это.
                startFixedWidth = state.startFixedWidth;
                endFixedWidth = state.endFixedWidth;
                scrollableWidth =
                    action.scrollableWidth || state.contentWidth - startFixedWidth - endFixedWidth;
            }

            action.enrichedCallback({
                viewPortWidth,
                startFixedWidth,
                endFixedWidth,
                contentWidth: startFixedWidth + scrollableWidth + endFixedWidth,
            });

            return state;
        }
        case 'updateSizes': {
            const currentSizes: IColumnScrollWidths = {
                viewPortWidth: state.viewPortWidth,
                contentWidth: state.contentWidth,
                startFixedWidth: state.startFixedWidth,
                endFixedWidth: state.endFixedWidth,
            };

            const newSizes: IColumnScrollWidths = {
                ...currentSizes,
                ...action.widths,
            };

            if (
                currentSizes.contentWidth === newSizes.contentWidth &&
                currentSizes.viewPortWidth === newSizes.viewPortWidth &&
                currentSizes.startFixedWidth === newSizes.startFixedWidth &&
                currentSizes.endFixedWidth === newSizes.endFixedWidth
            ) {
                return state;
            }

            const hasAllSizes = (sizes: IColumnScrollWidths) =>
                sizes.startFixedWidth !== 0 &&
                sizes.contentWidth !== 0 &&
                sizes.viewPortWidth !== 0;

            const newState = { ...state };

            newState.viewPortWidth = newSizes.viewPortWidth;
            newState.contentWidth = newSizes.contentWidth;
            newState.startFixedWidth = newSizes.startFixedWidth;
            newState.endFixedWidth = newSizes.endFixedWidth;

            DebugLogger.contextSizesUpdated(
                currentSizes,
                newSizes,
                action.privateContextUserSymbol
            );

            let newPosition = state.position;

            if (hasAllSizes(newSizes)) {
                // Первая установка всех размеров.
                if (!hasAllSizes(currentSizes)) {
                    // Устанавливаем максимальную позицию скролла, если была установлена изначальная позиция скролла
                    // "вконец".
                    if (state.columnScrollStartPosition === 'end') {
                        newPosition = getMaxScrollPosition(newSizes);
                    }

                    // Если было передано конкретное значение в пикселях, то валидируем и корректируем его.
                    // Не нужно позволять устанавливать позицию больше или меньше возможной.
                    if (typeof state.columnScrollStartPosition === 'number') {
                        newPosition = getLimitedPosition(state.columnScrollStartPosition, newSizes);
                        if (newPosition < state.position || state.position < 0) {
                            Logger.warn(
                                'Ошибка конфигурации горизонтального скролл в таблице! \n' +
                                    'Задана неверная начальная позиция скролла! \n' +
                                    `Опции columnScrollStartPosition передано значение {${state.position}}(px), при допустимых значениях \n` +
                                    'от 0 до максимальной позиции скролла. \n' +
                                    `В данном построении это значение от 0 до ${getMaxScrollPosition(
                                        newSizes
                                    )}. \n` +
                                    'Скачек таблицы при построении по прикладной ошибке!'
                            );
                        }
                    }
                } else {
                    // TODO: #TEST
                    // Если контент стал меньше, то позицию скролла нужно ограничить по новому размеру.
                    newPosition = getLimitedPosition(newPosition, newSizes);
                }

                if (newState.position !== newPosition) {
                    DebugLogger.contextStateSetPosition(state.position, newPosition);
                    newState.position = newPosition;
                    action.onPositionChanged?.(newPosition);
                }

                const newEdgesState = getEdgesState(newPosition, newSizes);

                updateEdgesStateMutable(state, newState, newEdgesState);

                if (
                    updateTriggersStateMutable(state, newState, newEdgesState) &&
                    action.onEdgesStateChanged
                ) {
                    action.onEdgesStateChanged(
                        newState.leftTriggerEdgeState,
                        newState.rightTriggerEdgeState
                    );
                }

                newState.isNeedByWidth = newSizes.contentWidth > newSizes.viewPortWidth;
            }

            return newState;
        }
    }
}

export default contextReducer;
