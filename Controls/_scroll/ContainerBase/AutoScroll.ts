import { SyntheticEvent } from 'UICommon/Events';
import {
    getScrollContainerPageCoords,
    IContainerCoords,
    ICursorOnBorderParams,
    isCursorAtScrollPoint,
    SCROLL_DIRECTION,
} from 'Controls/_scroll/Utils/Scroll';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';

// Величина, на которую осуществляется автоскролл при курсоре за скролл контейнером.
export const AUTOSCROLL_DELTA: number = 15;
// Величина виртуальной границы относительно верхнего/нижнего края скролл контейнера при попадании в которую нужно
// запустить процесс автоскролла.
export const AUTOSCROLL_SIZE: number = 70;
// Задержка, когда запущен автоскролл
export const DELAY = 20;
// Задержка ожидания запуска автоскрола
export const WAIT_DELAY = 200;

export interface IAutoScrollOptions {
    scrollOrientation: SCROLL_MODE;
    topPlaceholderSize: number;
    scrollTop: number;
    scrollLeft: number;
}
interface ICursorPosition {
    pageX: number;
    pageY: number;
}

export default class AutoScroll {
    readonly _scrollContainer: HTMLElement;
    readonly _setScrollTop: Function;
    readonly _horizontalScrollTo: Function;

    private _autoScrollInterval: number;
    private _scrollContainerCoords: IContainerCoords;
    private _cursorOnVerticalBorder: ICursorOnBorderParams;
    private _cursorOnHorizontalBorder: ICursorOnBorderParams;
    private _scrollOrientation: SCROLL_MODE;
    private _topPlaceholderSize: number;
    private _waitAutoScroll: number = null;
    // Флаги, идентифицирующие что нужно пропустить обработку автоскролла
    private _skipHorizontalAutoscroll: boolean = false;
    private _skipVerticalAutoscroll: boolean = false;

    private _scrollTop: number;
    private _scrollLeft: number;

    constructor(container: HTMLElement, setScrollTop: Function, horizontalScrollTo: Function) {
        this._scrollContainer = container;
        this._setScrollTop = setScrollTop;
        this._horizontalScrollTo = horizontalScrollTo;
    }

    updateOptions(options: IAutoScrollOptions): void {
        this._scrollOrientation = options.scrollOrientation;
        this._topPlaceholderSize = options.topPlaceholderSize;
        this._scrollTop = options.scrollTop;
        this._scrollLeft = options.scrollLeft;
    }

    getCursorPosition(event: SyntheticEvent): ICursorPosition {
        const mouseEvent = event.nativeEvent || event;
        return {
            pageX:
                (mouseEvent as MouseEvent).pageX !== undefined
                    ? (mouseEvent as MouseEvent).pageX
                    : (mouseEvent as TouchEvent).targetTouches[0].clientX,
            pageY:
                (mouseEvent as MouseEvent).pageY !== undefined
                    ? (mouseEvent as MouseEvent).pageY
                    : (mouseEvent as TouchEvent).targetTouches[0].clientY,
        };
    }
    // Обработка движения курсора мыши для инициирования автоскролла в случае,
    // если курсор находится в области кнопки навигации
    onMouseMove(
        event: SyntheticEvent,
        verticalScrollAvailable: boolean,
        horizontalScrollAvailable: boolean
    ): void {
        if (!verticalScrollAvailable && !horizontalScrollAvailable) {
            return;
        }
        const cursorPosition = this.getCursorPosition(event);

        this._scrollContainerCoords = getScrollContainerPageCoords(this._scrollContainer);

        this.startAutoScroll(cursorPosition, verticalScrollAvailable, horizontalScrollAvailable);
    }

    onMouseLeave() {
        this.stopWaitAutoScroll();
        this.stopAutoScroll();
    }

    // Запускает автоскролл
    startAutoScroll(
        cursorPosition: ICursorPosition,
        verticalScrollAvailable: boolean = true,
        horizontalScrollAvailable: boolean = true,
        scrollHandler: () => void = undefined,
        context?: object
    ): void {
        let processHorizontalScroll = false;
        let processVerticalScroll = false;
        if (horizontalScrollAvailable) {
            this._cursorOnHorizontalBorder = isCursorAtScrollPoint(
                this._scrollContainerCoords,
                cursorPosition,
                AUTOSCROLL_SIZE,
                SCROLL_DIRECTION.HORIZONTAL
            );
            processHorizontalScroll = this._updateProcessScroll(
                this._cursorOnHorizontalBorder,
                SCROLL_DIRECTION.HORIZONTAL
            );
        }
        if (verticalScrollAvailable) {
            this._cursorOnVerticalBorder = isCursorAtScrollPoint(
                this._scrollContainerCoords,
                cursorPosition,
                AUTOSCROLL_SIZE,
                SCROLL_DIRECTION.VERTICAL
            );
            processVerticalScroll = this._updateProcessScroll(
                this._cursorOnVerticalBorder,
                SCROLL_DIRECTION.VERTICAL
            );
        }
        const shouldProcessScroll = processHorizontalScroll || processVerticalScroll;
        // Если движение в области скролла зафиксированно впервые
        if (shouldProcessScroll && !this._autoScrollInterval && !this._waitAutoScroll) {
            // Подождем, возможно, мы попали туда случайно
            this._waitAutoScroll = setTimeout(() => {
                this._autoScrollInterval = setInterval(() => {
                    if (scrollHandler) {
                        scrollHandler.bind(context)();
                    }
                    if (verticalScrollAvailable) {
                        this._processScroll(
                            this._cursorOnVerticalBorder,
                            SCROLL_DIRECTION.VERTICAL
                        );
                    }
                    if (horizontalScrollAvailable) {
                        this._processScroll(
                            this._cursorOnHorizontalBorder,
                            SCROLL_DIRECTION.HORIZONTAL
                        );
                    }
                }, DELAY);
            }, WAIT_DELAY);
        } else if (!shouldProcessScroll) {
            this.stopWaitAutoScroll();
            this.stopAutoScroll();
        }
    }
    stopAutoScroll(): void {
        clearInterval(this._autoScrollInterval);
        this._autoScrollInterval = null;
    }

    stopWaitAutoScroll(): void {
        clearTimeout(this._waitAutoScroll);
        this._waitAutoScroll = null;
    }

    private _processScroll(cursorParams: ICursorOnBorderParams, direction: SCROLL_DIRECTION): void {
        if (!this._isSupportScrollDirection(this._scrollOrientation, direction)) {
            return;
        }

        const isVertical = direction === SCROLL_DIRECTION.VERTICAL;
        const scrollPosition = isVertical
            ? this._scrollTop + this._topPlaceholderSize
            : this._scrollLeft;
        const setScrollPosition = (isVertical ? this._setScrollTop : this._horizontalScrollTo).bind(
            this
        );
        const autoScrollDelta = this._calcAutoScrollDelta(cursorParams);
        if (cursorParams.nearStart && cursorParams.inScrollLine) {
            setScrollPosition(scrollPosition - autoScrollDelta);
        }

        if (cursorParams.nearEnd && cursorParams.inScrollLine) {
            setScrollPosition(scrollPosition + autoScrollDelta);
        }
    }
    private _calcAutoScrollDelta(cursorParams: ICursorOnBorderParams): number {
        let autoScrollDelta;
        if (cursorParams.near) {
            autoScrollDelta = this._deltaLinearFunction(cursorParams.coordsToInternalBorder);
        } else {
            autoScrollDelta = AUTOSCROLL_DELTA;
        }
        return autoScrollDelta;
    }

    private _deltaLinearFunction(x: number): number {
        return -(9 / 70) * x + 10;
    }

    private _updateProcessScroll(
        cursorParams: ICursorOnBorderParams,
        direction: SCROLL_DIRECTION
    ): boolean {
        if (!cursorParams.inContainer) {
            return true;
        }

        const isVertical = direction === SCROLL_DIRECTION.VERTICAL;
        const flagName = `_skip${isVertical ? 'Vertical' : 'Horizontal'}Autoscroll`;

        // Если курсор не внутри скролл контейнера и не рядом с его верхней/нижней границей или сказано, что нужно
        // пропустить обработку, то сбрасываем флаг пропуска и выходим с результатом false.
        if (!cursorParams.near || this[flagName]) {
            // Если курсор не в границах области в которой включается автоскролл, то сбрасываем _skipAutoscroll чтобы
            // автоскролл запустился при следующем заходе в область.
            if (!cursorParams.near) {
                this[flagName] = false;
            }

            return false;
        }

        return true;
    }

    private _isSupportScrollDirection(
        scrollOrientation: SCROLL_MODE,
        direction: SCROLL_DIRECTION
    ): boolean {
        if (direction === SCROLL_DIRECTION.VERTICAL) {
            return (
                scrollOrientation === SCROLL_MODE.VERTICAL_HORIZONTAL ||
                scrollOrientation === SCROLL_MODE.VERTICAL
            );
        }
        return (
            scrollOrientation === SCROLL_MODE.VERTICAL_HORIZONTAL ||
            scrollOrientation === SCROLL_MODE.HORIZONTAL
        );
    }

    destroy(): void {
        this.stopAutoScroll();
    }
}
