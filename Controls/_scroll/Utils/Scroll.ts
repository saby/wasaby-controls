/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { IScrollState } from './ScrollState';
import { DimensionsMeasurer } from 'Controls/sizeUtils';

export enum SCROLL_DIRECTION {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

interface IAxisParams {
    start: number;
    end: number;
    cursor: number;
}

export interface ICursorOnBorderParams {
    near: boolean;
    nearStart: boolean;
    nearEnd: boolean;
    coordsToInternalBorder: number;
    inContainer: boolean;
    inScrollLine: boolean;
}

export function scrollTo(
    container: HTMLElement,
    position: number,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
): void {
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        container.scrollTop = position;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        container.scrollLeft = position;
    }
}

export function getScrollPositionByState(
    state: IScrollState,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
) {
    let position: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        position = state.scrollTop || 0;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        position = state.scrollLeft || 0;
    }
    return position;
}

export function getViewportSizeByState(
    state: IScrollState,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
) {
    let viewportSize: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        viewportSize = state.clientHeight;
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        viewportSize = state.clientWidth;
    }
    return viewportSize;
}

export function getContentSizeByState(
    state: IScrollState,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
) {
    let contentSize: number;
    if (direction === SCROLL_DIRECTION.VERTICAL) {
        contentSize = Math.min(state.content?.scrollHeight || state.scrollHeight, state.scrollHeight);
    } else if (direction === SCROLL_DIRECTION.HORIZONTAL) {
        contentSize = state.scrollWidth;
    }
    return contentSize;
}

export enum SCROLL_POSITION {
    START = 'start',
    END = 'end',
    MIDDLE = 'middle',
}

const SCALE_ROUNDING_ERROR_FIX = 1.5;

export function getScrollPositionType(
    scrollPosition: number,
    viewportSize: number,
    contentSize: number
): SCROLL_POSITION {
    let curPosition: SCROLL_POSITION;
    if (scrollPosition <= 0) {
        curPosition = SCROLL_POSITION.START;
        // На масштабе появляются дробные пиксели в размерах скролл контейнера.
        // Прибавляем 1.5 пикселя, чтобы избежать неправильных расчетов позиции скролла.
    } else if (scrollPosition + viewportSize + SCALE_ROUNDING_ERROR_FIX >= contentSize) {
        curPosition = SCROLL_POSITION.END;
    } else {
        curPosition = SCROLL_POSITION.MIDDLE;
    }
    return curPosition;
}

export function getScrollPositionTypeByState(
    scrollState: IScrollState,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
): SCROLL_POSITION {
    return getScrollPositionType(
        getScrollPositionByState(scrollState, direction),
        getViewportSizeByState(scrollState, direction),
        getContentSizeByState(scrollState, direction)
    );
}

export function canScroll(viewportSize: number, contentSize: number): boolean {
    // Значения могут быть дробными т.к. мы считаем размеры с помощью getBoundingClientRect.
    // Округлим и не будем считать что скролл есть при дробных пикселях
    return Math.floor(contentSize - viewportSize) > 1;
}

export function canScrollByState(
    scrollState: IScrollState,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
): boolean {
    return canScroll(
        getViewportSizeByState(scrollState, direction),
        getContentSizeByState(scrollState, direction)
    );
}

/**
 * Интерфейс описывает структуру объекта, представляющего координаты элемента на странице
 * @private
 */
export interface IContainerCoords {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

/**
 * Возвращает координаты элемента скролл контейнера на странице
 */
export function getScrollContainerPageCoords(elem: HTMLElement): IContainerCoords {
    const box = DimensionsMeasurer.getBoundingClientRect(elem);
    const documentDimensions = DimensionsMeasurer.getElementDimensions(document.documentElement);
    const bodyDimensions = DimensionsMeasurer.getElementDimensions(document.body);
    const windowDimensions = DimensionsMeasurer.getWindowDimensions(elem);

    const scrollTop =
        windowDimensions.pageYOffset || documentDimensions.scrollTop || bodyDimensions.scrollTop;
    const scrollLeft =
        windowDimensions.pageXOffset || documentDimensions.scrollLeft || bodyDimensions.scrollLeft;

    const clientTop = documentDimensions.clientTop || bodyDimensions.clientTop || 0;
    const clientLeft = documentDimensions.clientLeft || bodyDimensions.clientLeft || 0;

    return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft,
        bottom: box.bottom + scrollTop - clientTop,
        right: box.right + scrollLeft - clientLeft,
    };
}

/**
 * Функция определяет находится ли курсор в месте (на границе скролл контейнера или над/под скролл контейнером), в котором нужно начать скролл при dnd.
 *
 * @param coords - координаты элемента относительно страницы
 * @param cursorPosition - объект, содержащий информацию о положении курсора относительно страницы
 * @param edge - величина виртуальной границы от нижнего/верхнего края элемента при попадании курсора в которую считать,
 * что курсор находится рядом с краем этого элемента
 * @param direction - направление, для которого производятся расчёты
 *
 * @return Объект с информацией находится ли курсор рядом с одной из границ и рядом с какой границе он находится
 */
export function isCursorAtScrollPoint(
    coords: IContainerCoords,
    cursorPosition: { pageX: number; pageY: number },
    edge: number,
    direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL
): ICursorOnBorderParams {
    let mainAxis: IAxisParams = null;
    let additionalAxis: IAxisParams = null;

    if (direction === SCROLL_DIRECTION.VERTICAL) {
        mainAxis = {
            start: coords.top,
            end: coords.bottom,
            cursor: cursorPosition.pageY,
        };
        additionalAxis = {
            start: coords.left,
            end: coords.right,
            cursor: cursorPosition.pageX,
        };
    } else {
        mainAxis = {
            start: coords.left,
            end: coords.right,
            cursor: cursorPosition.pageX,
        };
        additionalAxis = {
            start: coords.top,
            end: coords.bottom,
            cursor: cursorPosition.pageY,
        };
    }

    // Определяем находится ли курсор в рамках контейнера
    const inContainer = mainAxis.cursor > mainAxis.start && mainAxis.cursor < mainAxis.end;

    const inScrollLine =
        additionalAxis.cursor < additionalAxis.end && additionalAxis.cursor > additionalAxis.start;
    // Определяем находится ли курсор до начальной границы элемента
    const beforeScroll = mainAxis.cursor < mainAxis.start;
    // Определяем находится ли курсор после конечной границы элемента
    const afterScroll = mainAxis.cursor > mainAxis.end;
    // Определяем находится ли курсор у начальной границы элемента
    const nearStart = mainAxis.cursor > mainAxis.start && mainAxis.cursor < mainAxis.start + edge;
    // Определяем находится ли курсор у конечной границы элемента
    const nearEnd = mainAxis.cursor < mainAxis.end && mainAxis.cursor > mainAxis.end - edge;

    // Расстояние до начальной границы контейнера (курсор внутри контейнера)
    const coordsToStart =
        mainAxis.cursor - mainAxis.start < edge && mainAxis.cursor - mainAxis.start > 0
            ? mainAxis.cursor - mainAxis.start
            : undefined;
    // Расстояние до конечной границы контейнера (курсор внутри контейнера)
    const coordsToEnd =
        mainAxis.end - mainAxis.cursor < edge && mainAxis.end - mainAxis.cursor > 0
            ? mainAxis.end - mainAxis.cursor
            : undefined;

    return {
        nearStart: nearStart || beforeScroll,
        nearEnd: nearEnd || afterScroll,
        near: inContainer && (nearStart || nearEnd),
        coordsToInternalBorder: coordsToStart || coordsToEnd,
        inContainer,
        inScrollLine,
    };
}
