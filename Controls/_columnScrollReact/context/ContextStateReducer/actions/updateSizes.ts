import { IColumnScrollWidths } from '../../../common/interfaces';
import { DebugLogger } from '../../../common/DebugLogger';
import { Logger } from 'UICommon/Utils';
import { getEdgesState, getLimitedPosition, getMaxScrollPosition } from '../../../common/helpers';
import { EdgeState } from '../../../common/types';
import { updateEdgesStateMutable, updateTriggersStateMutable } from './common/helpers';
import { PrivateContextUserSymbol } from '../../ColumnScrollContext';
import { TState } from '../TState';

export type TUpdateSizesAction = {
    type: 'updateSizes';
    privateContextUserSymbol: typeof PrivateContextUserSymbol;
    widths: Partial<IColumnScrollWidths>;
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
};

export function updateSizes(state: TState, action: TUpdateSizesAction): TState {
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

    const newState = { ...state };

    newState.viewPortWidth = newSizes.viewPortWidth;
    newState.contentWidth = newSizes.contentWidth;
    newState.startFixedWidth = newSizes.startFixedWidth;
    newState.endFixedWidth = newSizes.endFixedWidth;

    DebugLogger.contextSizesUpdated(currentSizes, newSizes, action.privateContextUserSymbol);

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
            newState.previousAppliedPosition = state.position;
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
