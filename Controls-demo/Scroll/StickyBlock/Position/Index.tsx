import { forwardRef } from 'react';
import { StickyBlock, StickyGroup } from 'Controls/stickyBlock';
import { Container } from 'Controls/scroll';

function Content() {
    return <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>;
}

export default forwardRef(function PositionDoc(_, ref) {
    return <div
        className="tw-flex"
        ref={ref}>
        <div className="options-wrap" data-qa="controlsDemo_scroll__top">
            <div className="controls-text-label">position=top</div>
            <Container className="controlsDemo__ml2 controlsDemo_fixedWidth300 controlsDemo__height300"
                       scrollOrientation="verticalHorizontal">
                <div>
                    <StickyBlock position="top"
                                 className="tw-w-full controls-background-unaccented">
                        <div className="controls-padding-s">
                            StickyBlock, position = top
                        </div>
                    </StickyBlock>
                    <Content/>
                </div>
            </Container>
        </div>
        <div className="options-wrap" data-qa="controlsDemo_scroll__bottom">
            <div className="controls-text-label">position=bottom</div>
            <Container className="controlsDemo__ml2 controlsDemo_fixedWidth300 controlsDemo__height300"
                       scrollOrientation="verticalHorizontal">
                <div>
                    <Content/>
                    <StickyBlock position="bottom"
                                 className="tw-w-full controls-background-unaccented">
                        <div className="controls-padding-s">
                            StickyBlock, position = bottom
                        </div>
                    </StickyBlock>
                </div>
            </Container>
        </div>
        <div className="options-wrap" data-qa="controlsDemo_scroll__topBottom">
            <div className="controls-text-label">position=topBottom</div>
            <Container className="controlsDemo__ml2 controlsDemo_fixedWidth300 controlsDemo__height300"
                       scrollOrientation="verticalHorizontal">
                <div>
                    <Content/>
                    <StickyBlock position="topBottom"
                                 className="tw-w-full controls-background-unaccented">
                        <div className="controls-padding-s">
                            StickyBlock, position = topBottom
                        </div>
                    </StickyBlock>
                    <Content/>
                </div>
            </Container>
        </div>
        <div className="options-wrap controlsDemo_fixedWidth300" data-qa="controlsDemo_scroll__left">
            <div className="controls-text-label">position=left</div>
            <Container className="controlsDemo__ml2 controlsDemo__height300"
                       scrollOrientation="horizontal">
                <div className="tw-flex controlsDemo_fixedWidth600">
                    <StickyGroup>
                        <StickyBlock position="left"
                                     className="tw-h-full controls-background-unaccented">
                            <div className="controls-padding-s">
                                left
                            </div>
                        </StickyBlock>
                    </StickyGroup>
                    <Content/>
                </div>
            </Container>
        </div>
        <div className="options-wrap controlsDemo_fixedWidth300 controlsDemo__ml2" data-qa="controlsDemo_scroll__right">
            <div className="controls-text-label">position=right</div>
            <Container className="controlsDemo__ml2 controlsDemo__height300"
                       scrollOrientation="horizontal">
                <div className="tw-flex controlsDemo_fixedWidth600">
                    <Content/>
                    <StickyGroup>
                        <StickyBlock position="right"
                                     className="tw-h-full controls-background-unaccented">
                            <div className="controls-padding-s">
                                right
                            </div>
                        </StickyBlock>
                    </StickyGroup>
                </div>
            </Container>
        </div>
    </div>;
});