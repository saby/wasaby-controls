/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { SyntheticEvent } from 'UICommon/Events';
import {
    getScrollContainerPageCoords,
    IContainerCoords,
    ICursorOnBorderParams,
    isCursorAtScrollPoint,
    SCROLL_DIRECTION,
} from 'Controls/_scroll/Utils/Scroll';
import { SCROLL_MODE } from 'Controls/_scroll/Container/Type';
import { Entity } from 'Controls/dragnDrop';

// Величина, на которую осуществляется автоскролл при курсоре за скролл контейнером.
const AUTOSCROLL_DELTA: number = 15;
// Величина виртуальной границы относительно верхнего/нижнего края скролл контейнера при попадании в которую нужно
// запустить процесс автоскролла.
const AUTOSCROLL_SIZE: number = 70;

interface IDnDAutoScrollOptions {
    scrollOrientation: SCROLL_MODE;
    topPlaceholderSize: number;
    scrollTop: number;
    scrollLeft: number;
}

// Автоподскролл при DnD.
export default class DnDAutoScroll {
    readonly _scrollContainer: HTMLElement;
    readonly _setScrollTop: Function;
    readonly _horizontalScrollTo: Function;

    // Флаг, идентифицирующий включен или выключен в текущий момент функционал автоскролла при приближении мыши к
    // верхней/нижней границе скролл контейнера.
    private _autoScroll: boolean = false;
    private _autoScrollInterval: number;
    private _scrollContainerCoords: IContainerCoords;
    private _cursorOnVerticalBorder: ICursorOnBorderParams;
    private _cursorOnHorizontalBorder: ICursorOnBorderParams;
    private _scrollOrientation: SCROLL_MODE;
    private _topPlaceholderSize: number;
    // Флаги, идентифицирующие что нужно пропустить обработку автоскролла
    private _skipHorizontalAutoscroll: boolean = false;
    private _skipVerticalAutoscroll: boolean = false;

    private _scrollTop: number;
    private _scrollLeft: number;
    private _dragObject: {
        domEvent: MouseEvent;
        parentScrollContainerRect: DOMRect;
    };

    constructor(
        container: HTMLElement,
        setScrollTop: Function,
        horizontalScrollTo: Function
    ) {
        this._scrollContainer = container;
        this._setScrollTop = setScrollTop;
        this._horizontalScrollTo = horizontalScrollTo;
    }

    updateOptions(options: IDnDAutoScrollOptions): void {
        this._scrollOrientation = options.scrollOrientation;
        this._topPlaceholderSize = options.topPlaceholderSize;
        this._scrollTop = options.scrollTop;
        this._scrollLeft = options.scrollLeft;
    }

    onDragStart(dragObject: { entity: Entity; domEvent: MouseEvent }): void {
        const parentScrollContainer = dragObject.domEvent.target.closest(
            '.controls-Scroll-Container'
        );
        this._dragObject = {
            ...dragObject,
            parentScrollContainerRect: parentScrollContainer
                ? parentScrollContainer.getBoundingClientRect()
                : null,
        };
        this._autoScroll = !!dragObject.entity?.allowAutoscroll;
        this._scrollContainerCoords = getScrollContainerPageCoords(
            this._scrollContainer
        );

        const coords = getScrollContainerPageCoords(this._scrollContainer);
        // Если при начале перетаскивания курсор уже находится около границы контейнера,
        // то автоскролл запускать не нужно, надо дождаться пока он выйдет из области и только
        // при следующем заходе запустить процесс авто-скроллинга
        this._skipVerticalAutoscroll = isCursorAtScrollPoint(
            coords,
            dragObject.domEvent,
            AUTOSCROLL_SIZE
        ).near;
        this._skipHorizontalAutoscroll = isCursorAtScrollPoint(
            coords,
            dragObject.domEvent,
            AUTOSCROLL_SIZE,
            SCROLL_DIRECTION.HORIZONTAL
        ).near;
    }

    onDragEnd(): void {
        this._dragObject = null;
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this._autoScroll = false;
        // При окончании драга нужно стопнуть интервал.
        this.stopAutoScroll();
    }

    // Обрабатываем движение курсором мыши для того, что бы инициировать автоскролл когда курсор подходит к верхней
    // или нижней границе контейнера.
    onMouseMove(event: SyntheticEvent): void {
        if (!this._autoScroll) {
            return;
        }

        const mouseEvent = event.nativeEvent || event;
        const cursorPosition = {
            pageX:
                (mouseEvent as MouseEvent).pageX !== undefined
                    ? (mouseEvent as MouseEvent).pageX
                    : (mouseEvent as TouchEvent).targetTouches[0].clientX,
            pageY:
                (mouseEvent as MouseEvent).pageY !== undefined
                    ? (mouseEvent as MouseEvent).pageY
                    : (mouseEvent as TouchEvent).targetTouches[0].clientY,
        };

        if (this._dragObject.parentScrollContainerRect) {
            const isParentContainerOfDraggableElement =
                this._dragObject.domEvent.target.closest(
                    '.controls-Scroll-Container'
                ) === this._scrollContainer;
            const cursorOnParentContainer =
                this._dragObject.parentScrollContainerRect.left <
                    cursorPosition.pageX &&
                this._dragObject.parentScrollContainerRect.right >
                    cursorPosition.pageX &&
                this._dragObject.parentScrollContainerRect.top <
                    cursorPosition.pageY &&
                this._dragObject.parentScrollContainerRect.bottom >
                    cursorPosition.pageY;
            if (
                cursorOnParentContainer &&
                !isParentContainerOfDraggableElement
            ) {
                return;
            }
        }

        this._cursorOnVerticalBorder = isCursorAtScrollPoint(
            this._scrollContainerCoords,
            cursorPosition,
            AUTOSCROLL_SIZE,
            SCROLL_DIRECTION.VERTICAL
        );
        this._cursorOnHorizontalBorder = isCursorAtScrollPoint(
            this._scrollContainerCoords,
            cursorPosition,
            AUTOSCROLL_SIZE,
            SCROLL_DIRECTION.HORIZONTAL
        );

        const processScroll =
            this._updateProcessScroll(
                this._cursorOnVerticalBorder,
                SCROLL_DIRECTION.VERTICAL
            ) ||
            this._updateProcessScroll(
                this._cursorOnHorizontalBorder,
                SCROLL_DIRECTION.HORIZONTAL
            );

        if (processScroll && !this._autoScrollInterval) {
            const delay = 20;
            // Вешаем интервал чтобы если пользователь остановил курсор автоскролл продолжал работать
            this._autoScrollInterval = setInterval(() => {
                if (!this._autoScroll) {
                    this.stopAutoScroll();
                    return;
                }

                this._processScroll(
                    this._cursorOnVerticalBorder,
                    SCROLL_DIRECTION.VERTICAL
                );
                this._processScroll(
                    this._cursorOnHorizontalBorder,
                    SCROLL_DIRECTION.HORIZONTAL
                );
            }, delay);
        } else if (!processScroll) {
            this.stopAutoScroll();
        }
    }

    onMouseLeave(): void {
        if (this._autoScroll) {
            document.addEventListener('mousemove', this.onMouseMove.bind(this));
        }
        // При выходе курсора за границы скролл контейнера так же нужно сбросить
        // флаг что бы автоскролл запустился при следующем заходе в область
        this._skipVerticalAutoscroll = false;
        this._skipHorizontalAutoscroll = false;
    }

    stopAutoScroll(): void {
        clearInterval(this._autoScrollInterval);
        this._autoScrollInterval = null;
    }

    destroy(): void {
        this.stopAutoScroll();
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }

    private _processScroll(
        cursorParams: ICursorOnBorderParams,
        direction: SCROLL_DIRECTION
    ): void {
        if (
            !this._isSupportScrollDirection(this._scrollOrientation, direction)
        ) {
            return;
        }

        const isVertical = direction === SCROLL_DIRECTION.VERTICAL;
        const scrollPosition = isVertical
            ? this._scrollTop + this._topPlaceholderSize
            : this._scrollLeft;
        const setScrollPosition = (
            isVertical ? this._setScrollTop : this._horizontalScrollTo
        ).bind(this);
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
            autoScrollDelta = this._deltaLinearFunction(
                cursorParams.coordsToInternalBorder
            );
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
        const flagName = `_skip${
            isVertical ? 'Vertical' : 'Horizontal'
        }Autoscroll`;

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
}
