import { forwardRef } from 'react';
import { StickyBlock, StickyGroup } from 'Controls/stickyBlock';
import { Container } from 'Controls/scroll';

function Content() {
    return <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>;
}

export default forwardRef(function PositionDoc(_, ref) {
    return (
        <div className="tw-flex" ref={ref}>
            <div
                className="options-wrap controlsDemo_fixedWidth300"
                data-qa="controlsDemo_scroll__left"
            >
                <div className="controls-text-label">position=left</div>
                <Container
                    className="controlsDemo__ml2 controlsDemo__height300"
                    scrollOrientation="horizontal"
                >
                    <div className="tw-flex controlsDemo_fixedWidth600">
                        <Content />
                        <StickyGroup position="left">
                            <StickyBlock
                                position="left"
                                className="tw-h-full controls-background-unaccented"
                            >
                                <div className="controls-padding-s">left</div>
                            </StickyBlock>
                        </StickyGroup>
                        <Content />
                    </div>
                </Container>
            </div>
            <div
                className="options-wrap controlsDemo_fixedWidth300"
                data-qa="controlsDemo_scroll__left"
            >
                <div className="controls-text-label">position=leftRight</div>
                <Container
                    className="controlsDemo__ml2 controlsDemo__height300"
                    scrollOrientation="horizontal"
                >
                    <div className="tw-flex controlsDemo_fixedWidth600">
                        <Content />
                        <StickyGroup position="leftRight">
                            <StickyBlock
                                position="leftRight"
                                className="tw-h-full controls-background-unaccented"
                            >
                                <div className="controls-padding-s">leftRight</div>
                            </StickyBlock>
                        </StickyGroup>
                        <Content />
                    </div>
                </Container>
            </div>
            <div
                className="options-wrap controlsDemo_fixedWidth300 controlsDemo__ml2"
                data-qa="controlsDemo_scroll__right"
            >
                <div className="controls-text-label">position=right</div>
                <Container
                    className="controlsDemo__ml2 controlsDemo__height300"
                    scrollOrientation="horizontal"
                >
                    <div className="tw-flex controlsDemo_fixedWidth600">
                        <Content />
                        <StickyGroup position="right">
                            <StickyBlock
                                position="right"
                                className="tw-h-full controls-background-unaccented"
                            >
                                <div className="controls-padding-s">right</div>
                            </StickyBlock>
                        </StickyGroup>
                        <Content />
                    </div>
                </Container>
            </div>
        </div>
    );
});
