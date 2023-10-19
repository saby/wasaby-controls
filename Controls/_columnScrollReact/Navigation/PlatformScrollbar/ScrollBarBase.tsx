import * as React from 'react';
import Thumb, { TThumbProps } from './Thumb';
import { useHandler } from 'Controls/Hooks/useHandler';
import useResizeObserver from '../../common/hooks/useResizeObserver';
import {
    correctWheelDeltaForFirefox,
    getCurrentCoords,
    getMouseCoord,
    getScrollCoordByThumb,
    getThumbCoordByScroll,
    getThumbPosition,
} from './helpers';
import DnDWasabyContainer, { IDraggingData } from './WasabyDnd';
import { detection } from 'Env/Env';

const MIN_SIZE = 36;

type TScrollBarBaseDefaultProps = {
    className: string;
    readOnly: boolean;
    theme: string;
    shouldSetMarginTop: boolean;
    trackVisible: boolean;
    shouldNotUpdateBodyClass: boolean;
};

export type TScrollBarBaseProps = Partial<TScrollBarBaseDefaultProps> &
    Pick<TThumbProps, 'thumbStyle' | 'direction' | 'hasStartPadding' | 'hasEndPadding'> & {
        contentSize: number;
        position: number;
        thumbSize?: TThumbProps['size'];
        style?: React.CSSProperties;
        onPositionChanged?: (position: number) => void;
        onDraggingChanged?: (state: boolean) => void;
    };

export type TScrollBarBaseRef = React.ForwardedRef<HTMLDivElement>;

function useClasses(
    props: Pick<
        TScrollBarBaseProps,
        'theme' | 'direction' | 'thumbSize' | 'className' | 'shouldSetMarginTop' | 'trackVisible'
    > & {
        isDragging: boolean;
    }
): string {
    return React.useMemo(() => {
        const classes = [
            'controls-VScrollbar',
            `controls_scroll_theme-${props.theme}`,
            `controls-VScrollbar_${props.direction}`,
            `controls-VScrollbar_${props.direction}_size-${props.thumbSize}`,
            `controls-VScrollbar_horizontal-track_size-${props.thumbSize}`,
        ];

        if (props.className) {
            classes.push(props.className);
        }

        if (props.shouldSetMarginTop) {
            classes.push(`controls-VScrollbar_horizontal_margin-top_size-${props.thumbSize}`);
        }

        if (props.isDragging) {
            classes.push(`controls-VScrollbar_${props.direction}_dragging`);
            classes.push(`controls-VScrollbar_${props.direction}_dragging_size-${props.thumbSize}`);
        }

        if (props.direction === 'horizontal' && props.trackVisible) {
            classes.push(
                'controls-VScrollbar_horizontal-track',
                'controls-VScrollbar_horizontal-track'
            );
        }

        return classes.join(' ');
    }, [
        props.className,
        props.direction,
        props.isDragging,
        props.shouldSetMarginTop,
        props.theme,
        props.thumbSize,
        props.trackVisible,
    ]);
}

function getThumbWrapperStyle(
    direction: 'vertical' | 'horizontal',
    thumbSize: number,
    thumbPosition: number
): React.CSSProperties {
    if (direction === 'vertical') {
        return {
            height: thumbSize,
            transform: `translateY(${thumbPosition}px)`,
        };
    } else {
        return {
            width: thumbSize,
            transform: `translateX(${thumbPosition}px)`,
        };
    }
}

function ScrollBarBase(
    {
        shouldNotUpdateBodyClass,
        thumbSize: thumbThickness,
        contentSize,
        direction,
        className: propsClassName,
        readOnly,
        hasStartPadding,
        hasEndPadding,
        onDraggingChanged,
        onPositionChanged,
        shouldSetMarginTop,
        trackVisible,
        thumbStyle,
        position,
        style,
        theme,
    }: TScrollBarBaseProps,
    ref: TScrollBarBaseRef
): JSX.Element {
    const onDraggingChangedHandler = useHandler(onDraggingChanged);
    const onPositionChangedHandler = useHandler(onPositionChanged);

    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);

    const draggingDataRef = React.useRef<IDraggingData>(null);

    // region States
    const [thumbPosition, setThumbPosition] = React.useState(0);
    const [scrollbarSize, setScrollbarSize] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    // endregion States

    // region Hooks
    const observerRef = useResizeObserver<HTMLDivElement>(
        React.useCallback(
            (entry) => {
                setScrollbarSize(
                    direction === 'vertical' ? entry.contentRect.height : entry.contentRect.width
                );
            },
            [direction]
        )
    );

    const thumbSize = React.useMemo<number>(() => {
        if (!thumbRef.current) {
            return 0;
        }

        const viewportRatio = scrollbarSize / contentSize;
        const size = scrollbarSize * viewportRatio;
        // MIN_SIZE сделан для тестов, в юнит-тестах нет стилей, заданных на классах из-за этого
        // getComputedStyle возвращает NaN.
        const minSize =
            parseFloat(
                getComputedStyle(thumbRef.current)[
                    direction === 'vertical' ? 'min-height' : 'min-width'
                ]
            ) || MIN_SIZE;
        return Math.max(minSize, size);
    }, [contentSize, direction, scrollbarSize]);
    // endregion Hooks

    // region Effects
    React.useLayoutEffect(() => {
        setThumbPosition(getThumbCoordByScroll(scrollbarSize, thumbSize, contentSize, position));
    }, [contentSize, scrollbarSize, thumbSize, position]);

    // endregion Effects

    // region Callbacks
    const onDragStart = React.useCallback(
        (draggingData) => {
            draggingDataRef.current = draggingData;
            setIsDragging(true);
            onDraggingChangedHandler(true);
        },
        [onDraggingChangedHandler]
    );

    const onDragMove = React.useCallback(
        (dragObject: { domEvent: Event }) => {
            const mouseCoord = getMouseCoord(dragObject.domEvent, direction);

            const newThumbPosition = getThumbPosition(
                draggingDataRef.current.size,
                draggingDataRef.current.offset,
                mouseCoord,
                thumbSize,
                draggingDataRef.current.dragPointOffset
            );

            setThumbPosition(newThumbPosition);

            const newPosition = getScrollCoordByThumb(
                draggingDataRef.current.size,
                thumbSize,
                contentSize,
                newThumbPosition
            );

            onPositionChangedHandler(newPosition);
        },
        [contentSize, direction, onPositionChangedHandler, thumbSize]
    );

    const onDragEnd = React.useCallback(() => {
        draggingDataRef.current = null;
        setIsDragging(false);
        onDraggingChangedHandler(false);
    }, [onDraggingChangedHandler]);

    const onScrollbarMouseDown = React.useCallback<React.MouseEventHandler>(
        (event: React.MouseEvent) => {
            if (readOnly) {
                return;
            }

            const currentCoords = getCurrentCoords(scrollbarRef.current, direction);
            const mouseCoord = getMouseCoord(event.nativeEvent, direction);

            const newPosition = getScrollCoordByThumb(
                currentCoords.size,
                thumbSize,
                contentSize,
                getThumbPosition(
                    currentCoords.size,
                    currentCoords.offset,
                    mouseCoord,
                    thumbSize,
                    thumbSize / 2
                )
            );
            setThumbPosition(newPosition);
            onPositionChangedHandler(newPosition);
        },
        [contentSize, direction, onPositionChangedHandler, readOnly, thumbSize]
    );

    const onScrollbarWheel = React.useCallback(
        (event: React.WheelEvent): void => {
            if (readOnly || (direction === 'horizontal' && !event.shiftKey)) {
                return;
            }
            let newPosition =
                position + correctWheelDeltaForFirefox(detection.firefox, event.nativeEvent.deltaY);
            const maxPosition = contentSize - scrollbarSize;
            if (newPosition < 0) {
                newPosition = 0;
            } else if (newPosition > maxPosition) {
                newPosition = maxPosition;
            }
            onPositionChangedHandler(newPosition);
            setThumbPosition(
                getThumbCoordByScroll(scrollbarSize, thumbSize, contentSize, newPosition)
            );
        },
        [
            contentSize,
            direction,
            onPositionChangedHandler,
            position,
            readOnly,
            scrollbarSize,
            thumbSize,
        ]
    );
    // endregion Callbacks

    let className = useClasses({
        className: propsClassName,
        direction,
        thumbSize: thumbThickness,
        theme,
        shouldSetMarginTop,
        trackVisible,
        isDragging,
    });

    if (!thumbSize) {
        className += ' ws-invisible';
    }

    const thumbStyles = getThumbWrapperStyle(direction, thumbSize, thumbPosition);

    return (
        <div
            ref={(el) => {
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(el);
                    } else {
                        ref.current = el;
                    }
                }
                observerRef.current = el;
                scrollbarRef.current = el;
            }}
            className={className}
            style={style}
            data-qa={`VScrollbar_${direction}`}
            onMouseDown={onScrollbarMouseDown}
            onWheel={onScrollbarWheel}
        >
            <DnDWasabyContainer
                isEnabled={!readOnly}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                parentRef={scrollbarRef}
                childrenRef={thumbRef}
                direction={direction}
            >
                <Thumb
                    ref={thumbRef}
                    direction={direction}
                    hasStartPadding={hasStartPadding}
                    hasEndPadding={hasEndPadding}
                    style={thumbStyles}
                    thumbStyle={thumbStyle}
                    size={thumbThickness}
                />
            </DnDWasabyContainer>
        </div>
    );
}

const DEFAULT_PROPS: Required<TScrollBarBaseDefaultProps> = {
    readOnly: false,
    className: '',
    theme: 'default',
    shouldSetMarginTop: false,
    trackVisible: false,
    shouldNotUpdateBodyClass: false,
};

const ScrollBarBaseForwarded = React.forwardRef(ScrollBarBase);
ScrollBarBaseForwarded.defaultProps = DEFAULT_PROPS;

const ScrollBarBaseForwardedMemo = React.memo(ScrollBarBaseForwarded);
export default ScrollBarBaseForwardedMemo;
