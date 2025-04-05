import * as React from 'react';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';
import TimelineCanvasRender from 'Controls-Lists/_timelineGrid/render/TimelineCanvasRender';
import { ITimelineLayerComponentProps } from 'Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps';
import { getDimensions } from 'Controls/sizeUtils';

export interface IArrow {
    from: string;
    to: string;
    style?: IArrowStyle;
}

export interface IArrowStyle {
    color?: string | number;
    dotLine?: boolean;
    opacity?: number | string;
}

export interface IArrowDrawData {
    type: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    style: IArrowStyle;
}

/**
 * Слой отвечающий за формирование данных для отображения стрелок зависимостей между событиями.
 * @param data
 * @constructor
 */
function ArrowsLayer({ data }: ITimelineLayerComponentProps<IArrow>) {
    const OTHER_ARROWS_OPACITY = 0.5;
    const { container, range, hasDragStartEventKey, columnWidth, containerHeight } =
        React.useContext(TimelineDataContext);

    const containerTop = container ? getDimensions(container).top : 0;

    const dragStartEventKey = hasDragStartEventKey();
    const firstItem = container?.querySelector('.ControlsLists-dynamicGrid__item');
    const firstDynamicRowRect = firstItem
        ?.querySelector(
            '.controlsLists_dynamicGrid__gridCell.js-controls-GridColumnScroll__cell_scrollable'
        )
        ?.getBoundingClientRect();

    const [drawData, setDrawData] = React.useState([]);

    React.useLayoutEffect(() => {
        if (!container) return;

        const fixedColumns = firstItem?.querySelectorAll(
            '.js-controls-GridColumnScroll__cell_fixedStart'
        );

        let sumFixedColumnsWidth = 0;
        fixedColumns?.forEach((fixedColumn) => {
            sumFixedColumnsWidth += fixedColumn.getBoundingClientRect().width;
        });

        const calculatedData = data
            .map(({ from, to, style }) => {
                const elementOne = container?.querySelector(`[data-key="${from}"]`);
                const elementTwo = container?.querySelector(`[data-key="${to}"]`);

                if (elementOne && elementTwo && firstDynamicRowRect) {
                    const rectOne = elementOne.getBoundingClientRect();
                    const rectTwo = elementTwo.getBoundingClientRect();

                    const arrowFullOpacity =
                        !dragStartEventKey ||
                        dragStartEventKey === from ||
                        dragStartEventKey === to;

                    return {
                        type: 'arrow',
                        fromX: rectOne.right - firstDynamicRowRect.left + sumFixedColumnsWidth,
                        fromY: rectOne.top + rectOne.height / 2 - containerTop,
                        toX: rectTwo.left - firstDynamicRowRect.left + sumFixedColumnsWidth,
                        toY: rectTwo.top + rectTwo.height / 2 - containerTop,
                        style: {
                            ...style,
                            opacity: arrowFullOpacity ? 1 : OTHER_ARROWS_OPACITY,
                        },
                    };
                }
                return null;
            })
            .filter(Boolean);

        setDrawData(calculatedData);
    }, [range, data, dragStartEventKey, columnWidth, containerHeight]);

    if (!drawData) return null;
    return (
        <TimelineCanvasRender<IArrowDrawData>
            drawData={drawData}
            containerHeight={containerHeight}
        />
    );
}

export default ArrowsLayer;
