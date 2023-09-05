import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IControlProps } from 'Controls/interface';
import {
    DragScrollController,
    IDragScrollParams as IDragScrollControllerProps,
} from 'Controls/dragScroll';
import { ColumnScrollContext, PrivateContextUserSymbol } from '../context/ColumnScrollContext';
import { DragScrollContext, IDragScrollContext } from './DragScrollContext';
import { getMaxScrollPosition } from '../common/helpers';
import { RENDER_JS_SELECTOR } from 'Controls/input';

const NOT_DRAG_SCROLL_PLATFORM_SELECTORS = [RENDER_JS_SELECTOR];

export interface IDragScrollContextProviderProps extends TInternalProps, IControlProps {
    isDragScrollEnabled?: boolean;
}

function canDragScrollByOptions(isDragScrollEnabled?: boolean): boolean {
    return typeof isDragScrollEnabled === 'boolean' ? isDragScrollEnabled : true;
}

export function DragScrollContextProvider(
    props: IDragScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IDragScrollContextProviderProps> {
    const scrollContext = React.useContext(ColumnScrollContext);
    const scrollContextRef = scrollContext.contextRefForHandlersOnly;

    const [isOverlayShown, setIsOverlayShown] = React.useState(false);

    const [dragScrollController] = React.useState(
        new DragScrollController({
            onOverlayHide: () => {
                setIsOverlayShown(false);
            },
            onOverlayShown: () => {
                setIsOverlayShown(true);
            },
            canStartDragScrollCallback: (target: HTMLElement) => {
                const notDragScrollableComplexSelector = [
                    scrollContext.SELECTORS.FIXED_ELEMENT,
                    scrollContext.SELECTORS.NOT_DRAG_SCROLLABLE,
                    ...NOT_DRAG_SCROLL_PLATFORM_SELECTORS,
                ]
                    .map((selector) => {
                        return `.${selector}`;
                    })
                    .join(', ');

                return !target.closest(notDragScrollableComplexSelector);
            },
        })
    );

    React.useLayoutEffect(() => {
        setIsOverlayShown(scrollContext.isScrollbarDragging);
    }, [scrollContext.isScrollbarDragging]);

    const startDragScroll = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (
                !scrollContext.contextRefForHandlersOnly.current.isScrollbarDragging &&
                canDragScrollByOptions(props.isDragScrollEnabled) &&
                !scrollContext.isMobile
            ) {
                dragScrollController.startDragScroll(e);
            }
        },
        [props.isDragScrollEnabled, scrollContext.isMobile]
    );

    const moveDragScroll = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!scrollContext.contextRefForHandlersOnly.current.isScrollbarDragging) {
            const newPosition = dragScrollController.moveDragScroll(e);
            if (newPosition !== null) {
                scrollContextRef.current.setPosition(
                    newPosition,
                    undefined,
                    PrivateContextUserSymbol
                );
            }
        }
    }, []);

    const stopDragScroll = React.useCallback(() => {
        if (!scrollContext.contextRefForHandlersOnly.current.isScrollbarDragging) {
            dragScrollController.stopDragScroll();
        }
    }, []);

    React.useLayoutEffect(() => {
        dragScrollController.setScrollLength(getMaxScrollPosition(scrollContext));
    }, [scrollContext.viewPortWidth, scrollContext.fixedWidth, scrollContext.contentWidth]);

    React.useLayoutEffect(() => {
        dragScrollController.setScrollPosition(scrollContext.position);
    }, [scrollContext.position]);

    const contextRefForHandlersOnly = React.useRef<IDragScrollContext>();

    const setStartDragNDropCallback = React.useCallback(
        (callback: IDragScrollControllerProps['startDragNDropCallback']) => {
            dragScrollController.setStartDragNDropCallback(callback);
        },
        []
    );

    const setCanStartDragNDropCallback = React.useCallback(
        (callback: IDragScrollControllerProps['canStartDragNDropCallback']) => {
            dragScrollController.setCanStartDragNDropCallback(callback);
        },
        []
    );

    const contextValue = React.useMemo<IDragScrollContext>(() => {
        const value = {
            contextRefForHandlersOnly,

            isOverlayShown,

            startDragScroll,
            moveDragScroll,
            stopDragScroll,
            setStartDragNDropCallback,
            setCanStartDragNDropCallback,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, [isOverlayShown, startDragScroll]);

    return (
        <DragScrollContext.Provider value={contextValue}>
            {React.cloneElement(props.children as JSX.Element, {
                forwardedRef: ref,
            })}
        </DragScrollContext.Provider>
    );
}

export default React.memo(React.forwardRef(DragScrollContextProvider));
