/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { getCurrentCoords, getMouseCoord } from './helpers';
import { TScrollBarBaseProps } from './ScrollBarBase';
import { useHandler } from 'Controls/Hooks/useHandler';

export interface IDraggingData {
    dragPointOffset?: number;
    size?: number;
    offset?: number;
}

export type TDnDContainerProps = {
    isEnabled: boolean;
    children: JSX.Element;
    childrenRef: React.MutableRefObject<HTMLDivElement>;
    parentRef: React.MutableRefObject<HTMLDivElement>;

    onDragStart?: (draggingData: IDraggingData) => void;
    onDragMove?: (dragObject: { domEvent: MouseEvent }) => void;
    onDragEnd?: () => void;
} & Pick<TScrollBarBaseProps, 'direction'>;

function DnDContainer({
    isEnabled,
    direction,
    children,
    childrenRef,
    parentRef,
    onDragEnd,
    onDragMove,
    onDragStart,
}: TDnDContainerProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const shouldNotifyDragStartRef = React.useRef(false);
    const draggingDataRef = React.useRef<IDraggingData>({});

    const onWindowMouseMoveRef = React.useRef<(e: MouseEvent) => void>();
    const onWindowMouseLeaveRef = React.useRef<(e: MouseEvent) => void>();
    const onWindowMouseUpRef = React.useRef<(e: MouseEvent) => void>();

    const onWindowMouseMoveStable = React.useCallback<(e: MouseEvent) => void>((e) => {
        onWindowMouseMoveRef.current(e);
    }, []);

    const onWindowMouseUpStable = React.useCallback<(e: MouseEvent) => void>((e) => {
        onWindowMouseUpRef.current(e);
    }, []);

    const onWindowMouseLeaveStable = React.useCallback<(e: MouseEvent) => void>((e) => {
        onWindowMouseLeaveRef.current(e);
    }, []);

    onWindowMouseMoveRef.current = React.useMemo(
        () => (e) => {
            if (shouldNotifyDragStartRef.current) {
                onDragStart?.(draggingDataRef.current);
                shouldNotifyDragStartRef.current = false;
                setIsDragging(true);
            }
            onDragMove({
                domEvent: e,
            });
        },
        [onDragMove, onDragStart]
    );

    onWindowMouseUpRef.current = React.useMemo(
        () => (e) => {
            onDragEnd?.();
            draggingDataRef.current = {};
            shouldNotifyDragStartRef.current = false;
            setIsDragging(false);
            window.removeEventListener('mousemove', onWindowMouseMoveStable);
            window.removeEventListener('mouseup', onWindowMouseUpStable);
            window.removeEventListener('mouseleave', onWindowMouseLeaveStable);
        },
        [onDragEnd, onWindowMouseLeaveStable, onWindowMouseMoveStable, onWindowMouseUpStable]
    );

    onWindowMouseLeaveRef.current = React.useMemo(
        () => (e) => {
            onDragEnd?.();
            draggingDataRef.current = {};
            shouldNotifyDragStartRef.current = false;
            setIsDragging(false);
            window.removeEventListener('mousemove', onWindowMouseMoveStable);
            window.removeEventListener('mouseup', onWindowMouseUpStable);
            window.removeEventListener('mouseleave', onWindowMouseLeaveStable);
        },
        [onDragEnd, onWindowMouseLeaveStable, onWindowMouseMoveStable, onWindowMouseUpStable]
    );

    const onContentMouseDown = React.useCallback<React.MouseEventHandler>(
        (e: React.MouseEvent): void => {
            if (!isEnabled) {
                return;
            }
            // Отключаем выделение пока идет драг.
            e.preventDefault();
            e.stopPropagation();

            const thumbOffset =
                childrenRef.current.getBoundingClientRect()[
                    direction === 'vertical' ? 'top' : 'left'
                ];
            const mouseCoord = getMouseCoord(e.nativeEvent, direction);

            const currentCoords = getCurrentCoords(parentRef.current, direction);
            const dragPointOffset = mouseCoord - thumbOffset;
            draggingDataRef.current = {
                ...currentCoords,
                dragPointOffset,
            };

            shouldNotifyDragStartRef.current = true;
            window.addEventListener('mousemove', onWindowMouseMoveStable);
            window.addEventListener('mouseup', onWindowMouseUpStable);
            window.addEventListener('mouseleave', onWindowMouseLeaveStable);
        },
        [direction]
    );
    const onContentMouseDownHandler = useHandler(onContentMouseDown);

    return React.cloneElement(children, {
        isDragging,
        onMouseDown: onContentMouseDownHandler,
    });
}

export default React.memo(DnDContainer);
