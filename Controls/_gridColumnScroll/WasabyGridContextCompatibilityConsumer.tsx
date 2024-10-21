/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    ColumnScrollUtils,
    DragScrollContext,
    IDragScrollContext,
    DebugLogger,
} from 'Controls/columnScrollReact';

interface IProps {
    children: JSX.Element;
}

export interface ICompatibilityContext {
    // columnScroll
    columnScrollSelectors: IColumnScrollContext['SELECTORS'];
    isColumnScrollVisible: IColumnScrollContext['isNeedByWidth'];
    setColumnScrollPositionToPrevPage: () => boolean;
    setColumnScrollPositionToNextPage: () => boolean;
    setColumnScrollPositionToStart: (smooth?: boolean) => void;
    setColumnScrollPositionToEnd: (smooth?: boolean) => void;
    setColumnScrollPosition: (position: number, smooth?: boolean) => void;
    columnScrollScrollIntoView: IColumnScrollContext['scrollIntoView'];
    columnScrollUpdateSizes: (
        widths: Partial<
            Pick<
                IColumnScrollContext,
                'contentWidth' | 'startFixedWidth' | 'endFixedWidth' | 'viewPortWidth'
            >
        >
    ) => void;

    // dragScroll
    isDragScrollOverlayShown: IDragScrollContext['isOverlayShown'];
    setStartDragNDropCallback: IDragScrollContext['setStartDragNDropCallback'];
    setCanStartDragNDropCallback: IDragScrollContext['setCanStartDragNDropCallback'];
}

/**
 * Контрол-консьюмер скролл контекста для wasaby компонентов.
 * Нужен для совместимости, до перевода всех списков на реакт.
 *
 * @param props
 * @param ref
 * @private
 * @constructor
 */
export function WasabyGridContextCompatibilityConsumer(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IProps> {
    const columnScrollContext = React.useContext(ColumnScrollContext);
    const dragScrollContext = React.useContext(DragScrollContext);
    const columnScrollContextRef = columnScrollContext.contextRefForHandlersOnly;

    const columnScrollUpdateSizes = React.useCallback((widths) => {
        columnScrollContextRef.current.updateSizes(null, widths);
    }, []);

    const setColumnScrollPositionToPrevPage = React.useCallback(() => {
        const newPosition = ColumnScrollUtils.getPrevPagePosition(
            columnScrollContextRef.current.position,
            columnScrollContextRef.current
        );
        DebugLogger.contextSetPositionByGridControl('_keyDownLeft', newPosition, true);
        columnScrollContextRef.current.setPosition(newPosition, true);
        return columnScrollContextRef.current.position !== newPosition;
    }, []);

    const setColumnScrollPositionToNextPage = React.useCallback(() => {
        const newPosition = ColumnScrollUtils.getNextPagePosition(
            columnScrollContextRef.current.position,
            columnScrollContextRef.current
        );
        DebugLogger.contextSetPositionByGridControl('_keyDownRight', newPosition, true);
        columnScrollContextRef.current.setPosition(newPosition, true);
        return columnScrollContextRef.current.position !== newPosition;
    }, []);

    const setColumnScrollPositionToStart = React.useCallback((smooth?: boolean) => {
        DebugLogger.contextSetPositionPublic('Grid public API::scrollToLeft', 0, smooth);
        columnScrollContextRef.current.setPosition(0, smooth);
    }, []);

    const setColumnScrollPositionToEnd = React.useCallback((smooth?: boolean) => {
        const position = ColumnScrollUtils.getMaxScrollPosition(columnScrollContextRef.current);

        DebugLogger.contextSetPositionPublic('Grid public API::scrollToRight', position, smooth);
        columnScrollContextRef.current.setPosition(position, smooth);
    }, []);

    const setColumnScrollPosition = React.useCallback((position: number, smooth: boolean) => {
        DebugLogger.contextSetPositionPublic('Grid public API::setPosition', position, smooth);
        columnScrollContextRef.current.setPosition(position, smooth);
    }, []);

    const columnScrollScrollIntoView = React.useCallback<IColumnScrollContext['scrollIntoView']>(
        (target, align, smooth) => {
            DebugLogger.contextScrollIntoViewPublic(target, align, smooth);
            columnScrollContextRef.current.scrollIntoView(target, {
                align,
                autoScrollAnimation: smooth ? 'smooth' : 'none',
                autoScrollMode: columnScrollContextRef.current.autoScrollMode,
            });
        },
        []
    );

    const ctx: ICompatibilityContext = {
        // columnScroll
        columnScrollSelectors: columnScrollContext.SELECTORS,
        isColumnScrollVisible: columnScrollContext.isNeedByWidth,
        setColumnScrollPositionToPrevPage,
        setColumnScrollPositionToNextPage,
        setColumnScrollPositionToStart,
        setColumnScrollPositionToEnd,
        setColumnScrollPosition,
        columnScrollUpdateSizes,
        columnScrollScrollIntoView,
        // dragScroll
        isDragScrollOverlayShown: dragScrollContext.isOverlayShown,
        setStartDragNDropCallback: dragScrollContext.setStartDragNDropCallback,
        setCanStartDragNDropCallback: dragScrollContext.setCanStartDragNDropCallback,
    };

    return React.cloneElement(props.children, {
        forwardedRef: ref,
        ...ctx,
    });
}

export default React.memo(React.forwardRef(WasabyGridContextCompatibilityConsumer));
