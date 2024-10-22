import { PrivateContextUserSymbol } from '../../ColumnScrollContext';
import { TUpdateSizesState, updateSizes } from './updateSizes';
import { EdgeState } from '../../../common/types';
import { IColumnScrollWidths } from '../../../common/interfaces';

/**
 * Размеры частей скроллируемой области, переданные из обработчика изменения размеров.
 * Интерфейс отличается от IColumnScrollWidths полями scrollableWidth и contentWidth.
 * В TSizesForInternalUpdate есть отдельно ширина контента, за вычетом фиксированных областей,
 * в IColumnScrollWidths ширина контента уже включает их.
 * Так сделано для удобства использования библиотеки скролла сторонними компанентами, например таблицей.
 * Таблица резервирует строку и размещает в ней три блока с обзёрверами:
 * под фиксированную область вначале, основной скроллируемый контент и фиксированную область в конце.
 * Если обязать обзерверы соответствовать интерфейсу IColumnScrollWidths, то таблице придется
 * резервировать 2 строки. В первой два блока под обзерверы фиксированной
 * области вначале и в конце, а между ними пустой блок-заглушка.
 * Во второй строке один блок под обзёрвер всего контента таблицы.
 * Такой подход нецелесообразен и библиотека обеспечивает внутреннюю конвертацию размеров.
 */
type TSizesForInternalUpdate = {
    /**
     * Ширина контейнера таблицы.
     */
    viewPortWidth?: number;
    /**
     * Ширина зафиксированной части в начале.
     */
    startFixedWidth?: number;
    /**
     * Ширина зафиксированной части в конце.
     */
    endFixedWidth?: number;
    /**
     * Ширина контента таблицы, НЕ включая зафиксированные части.
     * Будет конвертирован в contentWidth, включающий в себя зафиксированные части.
     */
    scrollableWidth?: number;
};

export type TInternalUpdateSizesState = IColumnScrollWidths & TUpdateSizesState;

export type TInternalUpdateSizesAction = {
    type: 'internalUpdateSizes';
    onPositionChanged?: (position: number) => void;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
} & TSizesForInternalUpdate;

export function internalUpdateSizes<TState extends TInternalUpdateSizesState>(
    state: TState,
    action: TInternalUpdateSizesAction
): TState {
    return updateSizes(state, {
        type: 'updateSizes',
        widths: getWidthsByPartialChanges(state, action),
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
): Required<IColumnScrollWidths> {
    const viewPortWidth = newWidths.viewPortWidth || oldWidths.viewPortWidth;

    const startFixedWidth =
        typeof newWidths.startFixedWidth !== 'undefined'
            ? newWidths.startFixedWidth
            : oldWidths.startFixedWidth;
    const endFixedWidth =
        typeof newWidths.endFixedWidth !== 'undefined'
            ? newWidths.endFixedWidth
            : oldWidths.endFixedWidth;

    let scrollableWidth: number;

    // Размер скроллируемого контента тоже поменялся, обновим всё.
    if (typeof newWidths.scrollableWidth !== 'undefined') {
        // Все ширины есть
        scrollableWidth = newWidths.scrollableWidth;
    } else {
        // Размер скроллируемого контента не изменился и остался равен старому.
        // Старый размер скроллируемого контента равен старому размеру всего
        // контента за вычетом размеров зафиксированных частей.
        scrollableWidth =
            oldWidths.contentWidth - oldWidths.startFixedWidth - oldWidths.endFixedWidth;
    }

    return {
        viewPortWidth,
        startFixedWidth,
        endFixedWidth,
        contentWidth: startFixedWidth + scrollableWidth + endFixedWidth,
    };
}
