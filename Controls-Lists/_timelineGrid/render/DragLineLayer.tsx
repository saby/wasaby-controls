import * as React from 'react';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';
import TimelineCanvasRender from 'Controls-Lists/_timelineGrid/render/TimelineCanvasRender';
import { getDimensions } from 'Controls/sizeUtils';
import { ITimelineLayerComponentProps } from 'Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps';

interface IDragLineLayerProps {
    startEventKey?: string;
    buttonPosition?: 'right' | 'left' | null;
    lineColor?: string | null;
}
export interface IDragLineStyle {
    color?: string | number;
}
export interface IDragLineDrawData {
    type: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    style: IDragLineStyle;
}

function DragLineLayer({ data }: ITimelineLayerComponentProps<IDragLineLayerProps>) {
    const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const { containerRef } = React.useContext(TimelineDataContext);
    const containerHeight = containerRef.current ? getDimensions(containerRef.current).height : 0;
    const containerTop = containerRef.current ? getDimensions(containerRef.current).top : 0;

    const firstItem = containerRef.current?.querySelector('.ControlsLists-dynamicGrid__item');
    const firstDynamicRowRect = firstItem
        ?.querySelector(
            '.controlsLists_dynamicGrid__gridCell.js-controls-GridColumnScroll__cell_scrollable'
        )
        ?.getBoundingClientRect();

    const updateMousePosition = (event: MouseEvent) => {
        setMousePosition({
            x: event.clientX,
            y: event.clientY,
        });
    };

    React.useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => updateMousePosition(event);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const drawData = React.useMemo(() => {
        if (!containerRef.current) return null;

        const fixedColumns = firstItem?.querySelectorAll(
            '.js-controls-GridColumnScroll__cell_fixedStart'
        );
        let sumFixedColumnsWidth = 0;
        fixedColumns?.forEach((fixedColumn) => {
            sumFixedColumnsWidth += fixedColumn.getBoundingClientRect().width;
        });

        return data
            .map(({ startEventKey, buttonPosition, lineColor }): IDragLineDrawData => {
                const startElement = containerRef.current?.querySelector(
                    `[data-key="${startEventKey}"]`
                );

                if (startElement && firstDynamicRowRect && (mousePosition.x || mousePosition.y)) {
                    const startElementRect = startElement.getBoundingClientRect();
                    const fromX =
                        buttonPosition === 'right'
                            ? startElementRect.right -
                              firstDynamicRowRect.left +
                              sumFixedColumnsWidth
                            : startElementRect.left -
                              firstDynamicRowRect.left +
                              sumFixedColumnsWidth;
                    return {
                        type: 'dragLine',
                        fromX,
                        fromY: startElementRect.top + startElementRect.height / 2 - containerTop,
                        toX: mousePosition.x - firstDynamicRowRect.left + sumFixedColumnsWidth,
                        toY: mousePosition.y - containerTop,
                        style: {
                            color: lineColor || '#cc0000',
                        },
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [data, containerRef.current, mousePosition]);

    if (!drawData) return null;
    return (
        <TimelineCanvasRender<IDragLineDrawData>
            drawData={drawData}
            containerHeight={containerHeight}
        />
    );
}

export default DragLineLayer;
