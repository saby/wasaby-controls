/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import {
    DragScrollController,
    IDragScrollParams as IDragScrollControllerProps,
} from 'Controls/dragScroll';
import { ColumnScrollContext, PrivateContextUserSymbol } from '../context/ColumnScrollContext';
import { DragScrollContext, IDragScrollContext } from './DragScrollContext';
import { getMaxScrollPosition } from '../common/helpers';
import { RENDER_JS_SELECTOR } from 'Controls/input';

const NOT_DRAG_SCROLL_PLATFORM_SELECTORS = [
    RENDER_JS_SELECTOR,
    // Это прикладник может повесить на любое место в своём шаблоне.
    'js-controls-DragScroll__notDraggable',
];

export interface IDragScrollContextProviderProps extends Pick<IDragScrollContext, 'isEnabled'> {
    children: React.JSX.Element;
}

export function DragScrollContextProvider(
    props: IDragScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IDragScrollContextProviderProps> {
    const scrollContext = React.useContext(ColumnScrollContext);
    const scrollContextRef = scrollContext.contextRefForHandlersOnly;

    const [isOverlayShown, setIsOverlayShown] = React.useState(false);
    const isEnabled = React.useMemo(() => {
        return (
            !scrollContext.isMobile &&
            scrollContext.isNeedByWidth &&
            (typeof props.isEnabled === 'boolean' ? props.isEnabled : true)
        );
    }, [props.isEnabled, scrollContext.isMobile, scrollContext.isNeedByWidth]);

    const canStartDragScrollCallback = React.useCallback(
        (target: HTMLElement) => {
            const notDragScrollableComplexSelector = [
                scrollContext.SELECTORS.FIXED_ELEMENT,
                scrollContext.SELECTORS.FIXED_TO_RIGHT_EDGE_ELEMENT,
                scrollContext.SELECTORS.NOT_DRAG_SCROLLABLE,
                ...NOT_DRAG_SCROLL_PLATFORM_SELECTORS,
            ]
                .map((selector) => {
                    return `.${selector}`;
                })
                .join(', ');

            return !target.closest(notDragScrollableComplexSelector);
        },
        [
            scrollContext.SELECTORS.FIXED_ELEMENT,
            scrollContext.SELECTORS.FIXED_TO_RIGHT_EDGE_ELEMENT,
            scrollContext.SELECTORS.NOT_DRAG_SCROLLABLE,
        ]
    );

    const dragScrollController = React.useMemo(
        () =>
            new DragScrollController({
                onOverlayHide: () => {
                    setIsOverlayShown(false);
                },
                onOverlayShown: () => {
                    setIsOverlayShown(true);
                },
                canStartDragScrollCallback,
                scrollSpeedByDrag: 1,
            }),
        []
    );

    React.useLayoutEffect(() => {
        dragScrollController.setCanStartDragNDropCallback(canStartDragScrollCallback);
    }, [dragScrollController, canStartDragScrollCallback]);

    React.useLayoutEffect(() => {
        setIsOverlayShown(scrollContext.isScrollbarDragging);
    }, [scrollContext.isScrollbarDragging]);

    const startDragScroll = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (
                // TODO: Это можно убрать, просто запривентив клик в скроллбаре?
                !scrollContext.contextRefForHandlersOnly.current.isScrollbarDragging &&
                isEnabled
            ) {
                dragScrollController.startDragScroll(e);
            }
        },
        [isEnabled, scrollContext.isMobile]
    );

    const moveDragScroll = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
        // TODO: Это можно убрать, просто запривентив клик в скроллбаре?
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
        const ctx = scrollContext.contextRefForHandlersOnly.current;

        // TODO: Это можно убрать, просто запривентив клик в скроллбаре?
        if (!ctx.isScrollbarDragging) {
            if (dragScrollController.isScrolled()) {
                if (ctx.autoScrollAnimation !== 'none') {
                    ctx.scrollIntoView(ctx.position, {
                        align: 'auto',
                        autoScrollAnimation: ctx.autoScrollAnimation,
                        privateContextUserSymbol: PrivateContextUserSymbol,
                        autoScrollMode: ctx.autoScrollMode,
                    });
                } else {
                    ctx.setPosition(ctx.position);
                }
            }
            dragScrollController.stopDragScroll();
        }
    }, []);

    React.useLayoutEffect(() => {
        dragScrollController.setScrollLength(getMaxScrollPosition(scrollContext));
    }, [
        scrollContext.startFixedWidth,
        scrollContext.endFixedWidth,
        scrollContext.contentWidth,
        scrollContext.viewPortWidth,
    ]);

    React.useLayoutEffect(() => {
        dragScrollController.setScrollPosition(scrollContext.position);
    }, [scrollContext.position]);

    const contextRefForHandlersOnly = React.useRef<IDragScrollContext>(
        undefined as unknown as IDragScrollContext
    );

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

            isEnabled,
            isOverlayShown,

            startDragScroll,
            moveDragScroll,
            stopDragScroll,
            setStartDragNDropCallback,
            setCanStartDragNDropCallback,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, [isOverlayShown, isEnabled, startDragScroll]);

    return (
        <DragScrollContext.Provider value={contextValue}>
            {React.cloneElement(props.children as React.JSX.Element, {
                forwardedRef: ref,
            })}
        </DragScrollContext.Provider>
    );
}

export default React.memo(React.forwardRef(DragScrollContextProvider));
