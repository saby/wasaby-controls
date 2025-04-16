import { forwardRef, LegacyRef, useState } from 'react';
import { ResizingLine } from 'Controls/dragnDrop';
import 'css!Controls-demo/ResizingLine/CustomCursor/CustomCursor';

const CONTAINER_INITIAL_SIZE = 100;

export default forwardRef(function CustomCursor(_, ref: LegacyRef<HTMLDivElement>) {
    const [containerHeight, setContainerHeight] = useState<number>(CONTAINER_INITIAL_SIZE);

    const onOffsetChange = (offset: number) => {
        setContainerHeight(containerHeight + offset);
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <div className="controls-text-label">
                Потяните за нижний край, курсор диагональный слева снизу вправо вверх
            </div>
            <div className="controls-demo__container" style={{ height: containerHeight }}>
                <ResizingLine
                    className="controls-demo__CustomCursor-ResizingLine"
                    onOffset={onOffsetChange}
                    orientation="diagonalUpRight"
                    minOffset={containerHeight - 50}
                    cursorStyle="myCustomCursor"
                />
            </div>
        </div>
    );
});
