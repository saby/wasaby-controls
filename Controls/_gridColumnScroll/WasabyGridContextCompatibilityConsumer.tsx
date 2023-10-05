/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
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
    setColumnScrollPositionToPrevPage: () => void;
    setColumnScrollPositionToNextPage: () => void;
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
    }, []);

    const setColumnScrollPositionToNextPage = React.useCallback(() => {
        const newPosition = ColumnScrollUtils.getNextPagePosition(
            columnScrollContextRef.current.position,
            columnScrollContextRef.current
        );
        DebugLogger.contextSetPositionByGridControl('_keyDownRight', newPosition, true);
        columnScrollContextRef.current.setPosition(newPosition, true);
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
            columnScrollContextRef.current.scrollIntoView(target, align, smooth);
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
        setStartDragNDropCallback: dragScrollContext.setStartDragNDropCallback,
        setCanStartDragNDropCallback: dragScrollContext.setCanStartDragNDropCallback,
    };

    return React.cloneElement(props.children, {
        forwardedRef: ref,
        ...ctx,
    });
}

export default React.memo(React.forwardRef(WasabyGridContextCompatibilityConsumer));
