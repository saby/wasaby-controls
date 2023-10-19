export function getMouseCoord(nativeEvent: Event, direction: 'vertical' | 'horizontal'): number {
    let offset: number;
    const offsetAxis = direction === 'vertical' ? 'pageY' : 'pageX';

    if (nativeEvent instanceof MouseEvent) {
        offset = nativeEvent[offsetAxis];
    } else {
        offset = (nativeEvent as TouchEvent).touches[0][offsetAxis];
    }

    return offset;
}

export function getCurrentCoords(
    scrollbar: HTMLDivElement,
    direction: 'vertical' | 'horizontal'
): {
    size: number;
    offset: number;
} {
    let offsetValue: number;
    let sizeValue: number;

    const scrollBarClientRect = scrollbar.getBoundingClientRect();
    if (direction === 'vertical') {
        offsetValue = scrollBarClientRect.top;
        sizeValue = scrollBarClientRect.height;
    } else {
        offsetValue = scrollBarClientRect.left;
        sizeValue = scrollBarClientRect.width;
    }
    return {
        offset: offsetValue,
        size: sizeValue,
    };
}

export function getThumbPosition(
    scrollbarSize: number,
    scrollbarOffset: number,
    mouseCoord: number,
    thumbSize: number,
    thumbSizeCompensation: number
): number {
    let thumbPosition: number;
    // ползунок должен оказываться относительно текущей позииции смещенным
    // при клике на половину своей высоты
    // при перетаскивании на то, расстояние, которое было до курсора в момент начала перетаскивания
    thumbPosition = mouseCoord - scrollbarOffset - thumbSizeCompensation;
    thumbPosition = Math.max(0, thumbPosition);
    thumbPosition = Math.min(thumbPosition, scrollbarSize - thumbSize);
    return thumbPosition;
}

export function getScrollCoordByThumb(
    scrollbarSize: number,
    thumbSize: number,
    contentSize: number,
    position: number
): number {
    if (scrollbarSize === undefined) {
        return 0;
    }

    // ползунок перемещается на расстояние равное высоте скроллбара - высота ползунка
    const availableScale = scrollbarSize - thumbSize;
    // скроллить можно на высоту контента, за вычетом высоты контейнера = высоте скроллбара
    const availableScroll = contentSize - scrollbarSize;
    // решаем пропорцию, известна координата ползунка, высота его перемещения и величину скроллящегося контента
    return (position * availableScroll) / availableScale;
}

export function getThumbCoordByScroll(
    scrollbarSize: number,
    thumbSize: number,
    contentSize: number,
    position: number
): number {
    if (scrollbarSize === undefined) {
        return 0;
    }

    // ползунок перемещается на расстояние равное высоте скроллбара - высота ползунка
    const availableScale = scrollbarSize - thumbSize;
    // скроллить можно на высоту контента, за вычетом высоты контейнера = высоте скроллбара
    const availableScroll = contentSize - scrollbarSize;
    // решаем пропорцию, известна координата ползунка, высота его перемещения и величину скроллящегося контента
    return (position * availableScale) / availableScroll;
}

export function correctWheelDeltaForFirefox(isFirefox: boolean, delta: number): number {
    if (isFirefox) {
        const additionalWheelOffset = 100;
        return Math.sign(delta) * additionalWheelOffset;
    }
    return delta;
}
