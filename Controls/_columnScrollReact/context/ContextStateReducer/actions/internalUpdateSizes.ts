import { PrivateContextUserSymbol } from '../../ColumnScrollContext';
import { TState } from '../TState';
import { updateSizes } from './updateSizes';
import { EdgeState } from '../../../common/types';
import { IColumnScrollWidths } from '../../../common/interfaces';

/**
 * Размеры частей скроллируемой области, переданные из обработчика изменения размеров.
 * @private
 */
type TSizesForInternalUpdate = {
    viewPortWidth?: number;
    startFixedWidth?: number;
    endFixedWidth?: number;
    scrollableWidth?: number;
};

export type TInternalUpdateSizesAction = ({
    type: 'internalUpdateSizes';
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
} & TSizesForInternalUpdate);

export function internalUpdateSizes(state: TState, action: TInternalUpdateSizesAction): TState {
    const { startFixedWidth, endFixedWidth, scrollableWidth, viewPortWidth } =
        getWidthsByPartialChanges(state, action);

    return updateSizes(state, {
        type: 'updateSizes',
        widths: {
            startFixedWidth,
            contentWidth: startFixedWidth + scrollableWidth + endFixedWidth,
            endFixedWidth,
            viewPortWidth,
        },
        privateContextUserSymbol: PrivateContextUserSymbol,
        onPositionChanged: action.onPositionChanged,
        onEdgesStateChanged: action.onEdgesStateChanged,
    });
}

/**
 * Возвращает все размеры, на основании изменения я только некоторых.
 * @param oldWidths Полный набор старых размеров.
 * @param newWidths Частичный набор новых размеров.
 */
function getWidthsByPartialChanges(
    oldWidths: IColumnScrollWidths,
    newWidths: TSizesForInternalUpdate
): Required<TSizesForInternalUpdate> {
    const viewPortWidth = newWidths.viewPortWidth || oldWidths.viewPortWidth;

    let startFixedWidth: number;
    let endFixedWidth: number;
    let scrollableWidth: number;

    if (
        typeof newWidths.startFixedWidth !== 'undefined' ||
        typeof newWidths.endFixedWidth !== 'undefined'
    ) {
        // Изменились обе фиксированные части, от них можно посчитать размеры в любом случае.
        if (
            typeof newWidths.startFixedWidth !== 'undefined' &&
            typeof newWidths.endFixedWidth !== 'undefined'
        ) {
            // Размер скроллируемого контента тоже поменялся, обновим всё.
            if (typeof newWidths.scrollableWidth !== 'undefined') {
                // Все ширины есть
                startFixedWidth = newWidths.startFixedWidth;
                endFixedWidth = newWidths.endFixedWidth;
                scrollableWidth = newWidths.scrollableWidth;
            } else {
                // Размер скроллируемого контента не изменился, высчитаем его с изменнеными ширинами.
                startFixedWidth = newWidths.startFixedWidth;
                endFixedWidth = newWidths.endFixedWidth;
                scrollableWidth =
                    oldWidths.contentWidth - newWidths.startFixedWidth - newWidths.endFixedWidth;
            }
        } else if (typeof newWidths.startFixedWidth !== 'undefined') {
            // Поменялись размеры фиксированной в начале части.
            // Может быть поменялся скроллируемый контент, прочекаем это.
            startFixedWidth = newWidths.startFixedWidth;
            endFixedWidth = oldWidths.endFixedWidth;
            scrollableWidth =
                newWidths.scrollableWidth ||
                oldWidths.contentWidth - startFixedWidth - endFixedWidth;
        } else {
            // Поменялись размеры фиксированной в конце части.
            // Может быть поменялся скроллируемый контент, прочекаем это.
            startFixedWidth = oldWidths.startFixedWidth;
            endFixedWidth = newWidths.endFixedWidth;
            scrollableWidth =
                newWidths.scrollableWidth ||
                oldWidths.contentWidth - startFixedWidth - endFixedWidth;
        }
    } else {
        // Фиксированные размеры не поменялись, но поменялся скроллируемый контент.
        // Может быть поменялся скроллируемый контент, прочекаем это.
        startFixedWidth = oldWidths.startFixedWidth;
        endFixedWidth = oldWidths.endFixedWidth;
        scrollableWidth =
            newWidths.scrollableWidth || oldWidths.contentWidth - startFixedWidth - endFixedWidth;
    }

    return {
        viewPortWidth,
        startFixedWidth,
        endFixedWidth,
        scrollableWidth
    };
}