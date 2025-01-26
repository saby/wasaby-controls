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
}

export interface IArrowDrawData {
    type: string;
    canvasRef: React.RefObject<HTMLCanvasElement>;
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
    const { containerRef } = React.useContext(TimelineDataContext);
    const containerHeight = containerRef.current ? getDimensions(containerRef.current).height : 0;

    const drawData = React.useMemo(() => {
        if (!containerRef.current) return null;
        const containerTop = containerRef.current ? getDimensions(containerRef.current).top : 0;

        const firstItem = containerRef.current.querySelector('.ControlsLists-dynamicGrid__item');
        const firstDynamicRowRect = firstItem
            ?.querySelector(
                '.controlsLists_dynamicGrid__gridCell.js-controls-GridColumnScroll__cell_scrollable'
            )
            ?.getBoundingClientRect();
        const fixedColumns = firstItem?.querySelectorAll(
            '.js-controls-GridColumnScroll__cell_fixedStart'
        );
        let sumFixedColumnsWidth = 0;
        fixedColumns?.forEach((fixedColumn) => {
            sumFixedColumnsWidth += fixedColumn.getBoundingClientRect().width;
        });
        return data
            .map(({ from, to, style }): IArrowDrawData => {
                const elementOne = containerRef.current?.querySelector(`[data-key="${from}"]`);
                const elementTwo = containerRef.current?.querySelector(`[data-key="${to}"]`);

                if (elementOne && elementTwo && firstDynamicRowRect) {
                    const rectOne = elementOne.getBoundingClientRect();
                    const rectTwo = elementTwo.getBoundingClientRect();
                    return {
                        type: 'arrow',
                        fromX: rectOne.right - firstDynamicRowRect.left + sumFixedColumnsWidth,
                        fromY: rectOne.top + rectOne.height / 2 - containerTop,
                        toX: rectTwo.left - firstDynamicRowRect.left + sumFixedColumnsWidth,
                        toY: rectTwo.top + rectTwo.height / 2 - containerTop,
                        style,
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [data, containerRef.current]);

    if (!drawData) return null;
    return (
        <TimelineCanvasRender<IArrowDrawData>
            drawData={drawData}
            containerHeight={containerHeight}
        />
    );
}

export default ArrowsLayer;
