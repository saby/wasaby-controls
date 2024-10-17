import { forwardRef, LegacyRef } from 'react';
import { Container } from 'Controls/scroll';
import { StickyBlock, StickyMode } from 'Controls/stickyBlock';

function ContentTemplate() {
    return <div className="controlsDemo-StickyHeader-MultiHeader__content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex
        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
        eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit
        anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
        ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit
        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa
        qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit
        in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>;
}

export default forwardRef(function Mode(_, ref: LegacyRef<HTMLDivElement>) {
    return <div
        className="controlsDemo__flex"
        ref={ref}
    >
        <div className="controlsDemo__wrapper">
            <span>Динамическое прилипание блока</span>
            <Container className="controlsDemo_fixedWidth350 controlsDemo__height300"
                       dataQa="controlsDemo_scrollmode__dynamic">
                <div>
                    <StickyBlock mode={StickyMode.Dynamic}>
                        <h2 className="controlsDemo__wrapper">Header</h2>
                    </StickyBlock>
                    <ContentTemplate/>
                </div>
            </Container>
        </div>
        <div className="controlsDemo__wrapper">
            <span>Dynamic и Stackable блок</span>
            <Container className="controlsDemo_fixedWidth350 controlsDemo__height300"
                       dataQa="controlsDemo_scrollmode__dynamic-stackable">
                <div>
                    <StickyBlock mode={StickyMode.Dynamic}>
                        <h2 className="controlsDemo__wrapper">Header</h2>
                    </StickyBlock>
                    <StickyBlock mode={StickyMode.Stackable}>
                        <h2 className="controlsDemo__wrapper">Header1</h2>
                    </StickyBlock>
                    <StickyBlock mode={StickyMode.Stackable}>
                        <h2 className="controlsDemo__wrapper">Header2</h2>
                    </StickyBlock>
                    <ContentTemplate/>
                </div>
            </Container>
        </div>
        <div className="controlsDemo__wrapper">
            <span>Stackable блок</span>
            <Container className="controlsDemo_fixedWidth350 controlsDemo__height300"
                       dataQa="controlsDemo_scrollmode__stackable">
                <div>
                    <StickyBlock mode={StickyMode.Stackable}>
                        <h2 className="controlsDemo__wrapper">Header1</h2>
                    </StickyBlock>
                    <ContentTemplate/>
                </div>
            </Container>
        </div>
    </div>;
});