import * as React from 'react';
import {
    ColumnScrollContext,
    ColumnScrollUtils,
    DragScrollContext,
} from 'Controls/columnScrollReact';

interface IProps {
    children: JSX.Element;
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
    const columnScrollContextRef =
        columnScrollContext.contextRefForHandlersOnly;

    const setColumnScrollPositionToPrevPage = React.useCallback(() => {
        const newPosition = ColumnScrollUtils.getPrevPagePosition(
            columnScrollContextRef.current.position,
            columnScrollContextRef.current
        );
        columnScrollContextRef.current.setPosition(newPosition, true);
    }, []);

    const setColumnScrollPositionToNextPage = React.useCallback(() => {
        const newPosition = ColumnScrollUtils.getNextPagePosition(
            columnScrollContextRef.current.position,
            columnScrollContextRef.current
        );
        columnScrollContextRef.current.setPosition(newPosition, true);
    }, []);

    const setColumnScrollPositionToStart = React.useCallback(() => {
        columnScrollContextRef.current.setPosition(0);
    }, []);

    const setColumnScrollPositionToEnd = React.useCallback(() => {
        columnScrollContextRef.current.setPosition(
            ColumnScrollUtils.getMaxScrollPosition(
                columnScrollContextRef.current
            )
        );
    }, []);

    const setColumnScrollPosition = React.useCallback(
        (position: number, smooth: boolean) => {
            columnScrollContextRef.current.setPosition(position, smooth);
        },
        []
    );

    return React.cloneElement(props.children, {
        forwardedRef: ref,
        // columnScroll
        columnScrollSelectors: columnScrollContext.SELECTORS,
        updateColumnScrollSizes: columnScrollContext.updateSizes,
        isColumnScrollVisible: columnScrollContext.isNeedByWidth,
        setColumnScrollPositionToPrevPage,
        setColumnScrollPositionToNextPage,
        setColumnScrollPositionToStart,
        setColumnScrollPositionToEnd,
        setColumnScrollPosition,
        // dragScroll
        setStartDragNDropCallback: dragScrollContext.setStartDragNDropCallback,
        setCanStartDragNDropCallback:
            dragScrollContext.setCanStartDragNDropCallback,
    });
}

export default React.memo(
    React.forwardRef(WasabyGridContextCompatibilityConsumer)
);
