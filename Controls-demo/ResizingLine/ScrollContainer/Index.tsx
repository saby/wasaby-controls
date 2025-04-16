import { forwardRef, LegacyRef } from 'react';
import { Container, SCROLL_MODE } from 'Controls/scroll';
import { ResizingLine } from 'Controls/dragnDrop';
import { useState } from 'react';
import 'css!Controls-demo/ResizingLine/ScrollContainer/ScrollContainer';

const CONTAINER_INITIAL_SIZE = 100;
const entityData = {
    allowAutoscroll: true,
};

export default forwardRef(function ButtonsMode(_, ref: LegacyRef<HTMLDivElement>) {
    const [rightContainerWidth, setRightContainerWidth] = useState(CONTAINER_INITIAL_SIZE);
    const [bottomContainerHeight, setBottomContainerHeight] = useState(CONTAINER_INITIAL_SIZE);

    const onHorizontalOffsetChange = (offset: number) => {
        setRightContainerWidth(rightContainerWidth + offset);
    };

    const onVerticalOffsetChange = (offset: number) => {
        setBottomContainerHeight(bottomContainerHeight + offset);
    };

    return (
        <div className="ControldDemo__wrapper tw-flex" ref={ref}>
            <div className="controlsDemo__wrapper__padding-left tw-flex tw-flex-col">
                <div className="controls-text-label">Потяните за правый край</div>
                <Container
                    className="Controls-demo-ResizingLine__scroll-container"
                    horizontalScrollMode="buttons"
                    buttonsMode="hover"
                    scrollOrientation={SCROLL_MODE.VERTICAL_HORIZONTAL}
                >
                    <div
                        className="Controls-demo-ResizingLine__container"
                        style={{
                            width: rightContainerWidth,
                        }}
                    >
                        <ResizingLine
                            className="Controls-demo-ResizingLine__resizing-line Controls-demo-ResizingLine__resizing-line_align-right"
                            orientation="horizontal"
                            onOffset={onHorizontalOffsetChange}
                            entity={entityData}
                            minOffset={rightContainerWidth - 50}
                        />
                    </div>
                </Container>
            </div>
            <div className="controlsDemo__wrapper__padding-left tw-flex tw-flex-col">
                <div className="controls-text-label">Потяните за нижний край</div>
                <Container
                    className="Controls-demo-ResizingLine__scroll-container"
                    horizontalScrollMode="buttons"
                    buttonsMode="hover"
                    scrollOrientation={SCROLL_MODE.VERTICAL_HORIZONTAL}
                >
                    <div
                        className="Controls-demo-ResizingLine__container"
                        style={{
                            height: bottomContainerHeight,
                        }}
                    >
                        <ResizingLine
                            className="Controls-demo-ResizingLine__resizing-line Controls-demo-ResizingLine__resizing-line_align-bottom"
                            orientation="vertical"
                            onOffset={onVerticalOffsetChange}
                            entity={entityData}
                            minOffset={bottomContainerHeight - 50}
                        />
                    </div>
                </Container>
            </div>
        </div>
    );
});
