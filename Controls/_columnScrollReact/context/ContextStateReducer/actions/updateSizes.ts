import { IColumnScrollWidths } from '../../../common/interfaces';
import { DebugLogger } from '../../../common/DebugLogger';
import { Logger } from 'UICommon/Utils';
import { getEdgesState, getLimitedPosition, getMaxScrollPosition } from '../../../common/helpers';
import { EdgeState } from '../../../common/types';
import {
    updateEdgesStateMutable,
    updateTriggersStateMutable,
    TStateWithEdgesState,
    TStateWithEdgesTriggersState,
} from './common/helpers';
import { PrivateContextUserSymbol } from '../../ColumnScrollContext';

export type TUpdateSizesState = IColumnScrollWidths &
    TStateWithEdgesState &
    TStateWithEdgesTriggersState & {
        position: number;
        columnScrollStartPosition: number | 'end' | undefined;
        previousAppliedPosition: number;
        isNeedByWidth: boolean;
        isInitializedSizes: boolean;
    };

export type TUpdateSizesAction = {
    type: 'updateSizes';
    privateContextUserSymbol: typeof PrivateContextUserSymbol;
    widths: Partial<IColumnScrollWidths>;
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
};

export function updateSizes<TState extends TUpdateSizesState>(
    state: TState,
    action: TUpdateSizesAction
): TState {
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
        sizes.startFixedWidth !== 0 && sizes.contentWidth !== 0 && sizes.viewPortWidth !== 0;

    const nextState = { ...state };

    nextState.viewPortWidth = newSizes.viewPortWidth;
    nextState.contentWidth = newSizes.contentWidth;
    nextState.startFixedWidth = newSizes.startFixedWidth;
    nextState.endFixedWidth = newSizes.endFixedWidth;

    DebugLogger.contextSizesUpdated(currentSizes, newSizes, action.privateContextUserSymbol);

    let newPosition = state.position;

    if (hasAllSizes(newSizes)) {
        // Первая установка всех размеров.
        if (!hasAllSizes(currentSizes)) {
            nextState.isInitializedSizes = true;
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

        if (nextState.position !== newPosition) {
            DebugLogger.contextStateSetPosition(state.position, newPosition);
            nextState.previousAppliedPosition = state.position;
            nextState.position = newPosition;
            action.onPositionChanged?.(newPosition);
        }

        const newEdgesState = getEdgesState(newPosition, newSizes);

        updateEdgesStateMutable(state, nextState, newEdgesState);

        if (
            updateTriggersStateMutable(state, nextState, newEdgesState) &&
            action.onEdgesStateChanged
        ) {
            action.onEdgesStateChanged(
                nextState.leftTriggerEdgeState,
                nextState.rightTriggerEdgeState
            );
        }

        nextState.isNeedByWidth = newSizes.contentWidth > newSizes.viewPortWidth;
    }

    return nextState;
}
