import * as React from 'react';
import { drawArrow, drawLine } from 'Controls-Lists/_timelineGrid/render/utils';
import { IArrowDrawData } from 'Controls-Lists/_timelineGrid/render/ArrowsLayer';
import { IDragLineDrawData } from 'Controls-Lists/_timelineGrid/render/DragLineLayer';
import type * as PIXI from 'pixi';
import { Graphics, Stage } from 'pixi-react';

interface ICanvasRenderProps<T> {
    drawData: T[];
    containerHeight: number;
}

function TimelineCanvasRender<T extends IArrowDrawData | IDragLineDrawData>({
    drawData,
    containerHeight,
}: ICanvasRenderProps<T>): React.ReactElement {
    const combinedDrawCallback = React.useCallback(
        (g: PIXI.Graphics) => {
            g.clear();
            drawData.forEach((params) => {
                switch (params.type) {
                    case 'arrow':
                        drawArrow(
                            g,
                            params.fromX,
                            params.fromY,
                            params.toX,
                            params.toY,
                            params.style
                        );
                        break;
                    case 'dragLine':
                        drawLine(
                            g,
                            params.fromX,
                            params.fromY,
                            params.toX,
                            params.toY,
                            params.style
                        );
                        break;
                    default:
                        break;
                }
            });
        },
        [drawData]
    );

    return (
        <Stage
            width={10000}
            height={containerHeight}
            options={{ backgroundAlpha: 0, antialias: true }}
            className={'ControlsLists-timelineGrid__canvasContainer'}
        >
            <Graphics key="combined-draw" draw={combinedDrawCallback} />
        </Stage>
    );
}

export default TimelineCanvasRender;
