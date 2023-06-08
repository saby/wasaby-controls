import * as React from 'react';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { Container as DnDContainer } from 'Controls/dragnDrop';
import { SyntheticEvent } from 'Vdom/Vdom';
import { detection } from 'Env/Env';
import { createElement, delimitProps } from 'UICore/Jsx';
import { getArgs } from 'UICore/Events';
import { usePreviousScrollbarProps } from './Hooks/UsePreviousScrollbarProps';
import 'css!Controls/scrollbar';

enum ScrollDirection {
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}

/**
 * Тонкий скроллбар.
 * @class Controls/_scrollbar/Scrollbar
 * @extends UI/Base:Control
 * @implements Controls/scrollbar:IScrollbars
 * @public
 * @implements Controls/interface:IControl
 * @demo Controls-demo/Scroll/Scrollbar/Default/Index
 */

interface IThumbProps {
    setThumbRef: Function;
    getThumbWrapperStyle: Function;
    getPaddingClasses: Function;
    thumbMouseDownHandler: React.MouseEventHandler;
    thumbThickness: string;
    direction: string;
    thumbStyle: string;
    dragging: boolean;
}

interface IResizeObserverEntry {
    readonly contentRect: DOMRectReadOnly;
    readonly target: Element;
}

interface IDraggingData {
    dragPointOffset?: number;
    size?: number;
    offset?: number;
}

const MIN_SIZE = 36;

function getMouseCoord(nativeEvent: Event, direction: string): number {
    let offset: number;
    const offsetAxis =
        direction === ScrollDirection.Vertical ? 'pageY' : 'pageX';

    if (nativeEvent instanceof MouseEvent) {
        offset = nativeEvent[offsetAxis];
    } else {
        offset = (nativeEvent as TouchEvent).touches[0][offsetAxis];
    }

    return offset;
}

function calcWheelDelta(delta: number): number {
    if (detection.firefox) {
        const additionalWheelOffset = 100;
        return Math.sign(delta) * additionalWheelOffset;
    }
    return delta;
}

const thumbNode = React.forwardRef((props: IThumbProps, ref) => {
    return (
        <div
            ref={(el: HTMLDivElement) => {
                props.setThumbRef(el);
                ref(el);
            }}
            className={
                `controls-VScrollbar__thumbWrapper controls-VScrollbar__thumbWrapper_size-${props.thumbThickness} controls-VScrollbar__thumbWrapper_${props.direction} ` +
                props.getPaddingClasses()
            }
            style={props.getThumbWrapperStyle()}
            onMouseDown={props.thumbMouseDownHandler}
        >
            <div
                className={
                    `controls-VScrollbar__thumb controls-VScrollbar__thumb_${props.thumbStyle} ` +
                    `controls-VScrollbar__thumb_size-${props.thumbThickness} ` +
                    `controls-VScrollbar__thumb_${props.thumbStyle} ` +
                    `controls-VScrollbar__thumb_${props.thumbStyle}_${props.direction} ` +
                    `controls-VScrollbar__thumb_${props.direction} ` +
                    `controls-VScrollbar__thumb_${props.direction}_size-${props.thumbThickness} ` +
                    `${
                        props.dragging
                            ? 'controls-VScrollbar__thumb_dragging_size-' +
                              props.thumbThickness +
                              ' controls-VScrollbar__thumb_dragging_' +
                              props.thumbStyle
                            : ''
                    }`
                }
                data-qa="VScrollbar__thumb"
            ></div>
        </div>
    );
});

function getThumbPosition(
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

function ScrollbarReact(
    {
        position = 0,
        contentSize,
        direction = 'vertical',
        thumbThickness = 'l',
        thumbStyle = 'accented',
        paddings = { start: false, end: false },
        ...props
    },
    forwardedRef: React.ForwardedRef<unknown>
): React.ReactElement {
    const scrollbarRef = React.useRef(null);
    const thumbRef = React.useRef(null);
    const dndRef = React.useRef(null);
    const [scrollbarSize, setScrollbarSize] = React.useState(undefined);
    const [dragging, setDragging] = React.useState(false);
    const [draggingData, setDraggingData] = React.useState<IDraggingData>({});
    const [thumbPosition, setThumbPosition] = React.useState(0);

    const { userAttrs } = delimitProps(props);

    const [resizeObserver] = React.useState(() => {
        return new ResizeObserverUtil(undefined, resizeHandler.bind(this));
    });

    const prevProps = usePreviousScrollbarProps({ contentSize });

    React.useLayoutEffect(() => {
        resizeObserver.observe(scrollbarRef.current);
        return () => {
            resizeObserver.unobserve(scrollbarRef.current);
        };
    }, []);

    React.useLayoutEffect(() => {
        if (detection.isIE && prevProps?.contentSize !== contentSize) {
            setScrollbarSize(
                direction === 'vertical'
                    ? scrollbarRef.current.clientHeight
                    : scrollbarRef.current.clientWidth
            );
        }
    });

    const thumbSize = React.useMemo(() => {
        if (!thumbRef.current) {
            return;
        }

        const viewportRatio = scrollbarSize / contentSize;
        const thumbSize = scrollbarSize * viewportRatio;
        // MIN_SIZE сделан для тестов, в юнит-тестах нет стилей, заданных на классах из-за этого
        // getComputedStyle возвращает NaN.
        const minSize =
            parseFloat(
                getComputedStyle(thumbRef.current)[
                    direction === ScrollDirection.Vertical
                        ? 'min-height'
                        : 'min-width'
                ]
            ) || MIN_SIZE;
        return Math.max(minSize, thumbSize);
    }, [scrollbarSize, contentSize, thumbRef.current]);

    React.useLayoutEffect(() => {
        const newThumbPosition = getThumbCoordByScroll(
            scrollbarSize,
            thumbSize,
            contentSize,
            position
        );
        setThumbPosition(newThumbPosition);
    }, [contentSize, scrollbarSize, thumbSize, position]);

    function getThumbCoordByScroll(
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

    function getScrollCoordByThumb(
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

    function resizeHandler(entries: IResizeObserverEntry[]): void {
        setScrollbarSize(
            direction === 'vertical'
                ? entries[0].contentRect.height
                : entries[0].contentRect.width
        );
    }

    function getCurrentCoords(direction: string): {
        size: number;
        offset: number;
    } {
        let offsetValue: number;
        let sizeValue: number;

        const scrollBarClientRect =
            scrollbarRef.current.getBoundingClientRect();
        if (direction === ScrollDirection.Vertical) {
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

    function thumbMouseDownHandler(event: React.MouseEvent): void {
        // Отключаем выделение пока идет драг.
        event.preventDefault();
        event.stopPropagation();
        scrollbarBeginDragHandler(event);
    }

    function scrollbarMouseDownHandler(event: React.MouseEvent): void {
        const currentCoords = getCurrentCoords(direction);
        const mouseCoord = getMouseCoord(event.nativeEvent, direction);

        const thumbPosition = getThumbPosition(
            currentCoords.size,
            currentCoords.offset,
            mouseCoord,
            thumbSize,
            thumbSize / 2
        );

        const newPosition = getScrollCoordByThumb(
            currentCoords.size,
            thumbSize,
            contentSize,
            thumbPosition
        );
        setThumbPosition(newPosition);
        props.onPositionchanged(undefined, newPosition);
    }

    function touchStartHandler(event: React.TouchEvent): void {
        if (direction === ScrollDirection.Horizontal) {
            scrollbarBeginDragHandler(event);
        }
    }

    function scrollbarBeginDragHandler(
        event: SyntheticEvent | React.MouseEvent | React.TouchEvent
    ): void {
        const verticalDirection = direction === ScrollDirection.Vertical;
        const thumbOffset =
            thumbRef.current.getBoundingClientRect()[
                verticalDirection ? 'top' : 'left'
            ];
        const mouseCoord = getMouseCoord(event.nativeEvent, direction);

        const currentCoords = getCurrentCoords(direction);
        const dragPointOffset = mouseCoord - thumbOffset;
        setDraggingData({ ...currentCoords, dragPointOffset });
        dndRef.current.startDragNDrop(null, event);
    }

    function scrollbarStartDragHandler(): void {
        setDragging(true);
        if (props.onDraggingchanged) {
            props.onDraggingchanged(undefined, true);
        }
    }

    function scrollbarEndDragHandler(): void {
        if (dragging) {
            setDragging(false);
            if (props.onDraggingchanged) {
                props.onDraggingchanged(undefined, false);
            }
        }
    }

    function scrollbarOnDragHandler(
        event: SyntheticEvent<Event>,
        dragObject: { domEvent: Event }
    ): void {
        const [_e, _dragObject] = getArgs(event, dragObject);
        const mouseCoord = getMouseCoord(_dragObject.domEvent, direction);

        const thumbPosition = getThumbPosition(
            draggingData.size,
            draggingData.offset,
            mouseCoord,
            thumbSize,
            draggingData.dragPointOffset
        );
        setThumbPosition(thumbPosition);
        const position = getScrollCoordByThumb(
            draggingData.size,
            thumbSize,
            contentSize,
            thumbPosition
        );
        props.onPositionchanged(undefined, position);
    }

    function wheelHandler(event: React.WheelEvent): void {
        let newPosition = position + calcWheelDelta(event.nativeEvent.deltaY);
        const maxPosition = contentSize - scrollbarSize;
        if (newPosition < 0) {
            newPosition = 0;
        } else if (newPosition > maxPosition) {
            newPosition = maxPosition;
        }
        props.onPositionchanged(undefined, newPosition);
        const newThumbPosition = getThumbCoordByScroll(
            scrollbarSize,
            thumbSize,
            contentSize,
            newPosition
        );
        setThumbPosition(newThumbPosition);
    }

    function getPaddingClasses(): string {
        const classes = [];
        if (direction === ScrollDirection.Vertical) {
            classes.push(
                `controls-padding_top-${paddings.start ? 'm' : '3xs'}`
            );
            classes.push(
                `controls-padding_bottom-${paddings.end ? 'm' : '3xs'}`
            );
        } else {
            classes.push(
                `controls-padding_left-${paddings.start ? 'm' : '3xs'}`
            );
            classes.push(
                `controls-padding_right-${paddings.end ? 'm' : '3xs'}`
            );
        }
        return classes.join(' ');
    }

    function getThumbWrapperStyle(): object {
        return {
            [direction === 'vertical' ? 'height' : 'width']: thumbSize + 'px',
            transform:
                `translate${direction === 'vertical' ? 'Y' : 'X'}(` +
                thumbPosition +
                'px)',
        };
    }

    function getClasses(): string {
        const classes = [];
        if (userAttrs && userAttrs.className) {
            classes.push(userAttrs.className);
        }
        classes.push(
            `controls_scroll_theme-${props.theme} controls-VScrollbar`
        );
        classes.push(
            `controls-VScrollbar_${direction} controls-VScrollbar_${direction}_size-${thumbThickness}`
        );
        classes.push(
            `controls-VScrollbar_horizontal-track_size-${thumbThickness}`
        );

        if (props.shouldSetMarginTop) {
            classes.push(
                `controls-VScrollbar_horizontal_margin-top_size-${thumbThickness}`
            );
        }

        if (dragging) {
            classes.push(`controls-VScrollbar_${direction}_dragging`);
            classes.push(
                `controls-VScrollbar_${direction}_dragging_size-${thumbThickness}`
            );
        }

        if (!thumbSize) {
            classes.push('ws-invisible');
        }

        if (direction === 'horizontal' && props.trackVisible) {
            classes.push(
                'controls-VScrollbar_horizontal-track controls-VScrollbar_horizontal-track'
            );
        }

        return classes.join(' ');
    }

    function getDnDEvents(): object {
        return {
            'on:customdragstart': [
                () => {
                    scrollbarStartDragHandler();
                },
            ],
            'on:dragmove': [
                (e, dragObject) => {
                    scrollbarOnDragHandler(e, dragObject);
                },
            ],
            'on:documentdragend': [
                () => {
                    scrollbarEndDragHandler();
                },
            ],
        };
    }

    function setThumbRef(el: HTMLDivElement): void {
        thumbRef.current = el;
    }

    return (
        <div
            ref={(el) => {
                scrollbarRef.current = el;
                forwardedRef?.(el);
            }}
            className={getClasses()}
            style={{
                ...((userAttrs && userAttrs.style) || {}),
                ...(props.style || {}),
            }}
            data-qa={`VScrollbar_${direction}`}
            onMouseDown={scrollbarMouseDownHandler}
            onTouchStart={touchStartHandler}
            onWheel={wheelHandler}
        >
            {createElement(
                DnDContainer,
                {
                    ref: dndRef,
                    content: thumbNode,
                    setThumbRef,
                    direction,
                    getPaddingClasses,
                    getThumbWrapperStyle,
                    thumbMouseDownHandler,
                    thumbStyle,
                    thumbThickness,
                    dragging,
                },
                undefined,
                { ...getDnDEvents() }
            )}
        </div>
    );
}

export default React.forwardRef(ScrollbarReact);
