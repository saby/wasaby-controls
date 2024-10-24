import { Container, SCROLL_MODE } from 'Controls/scroll';
import { LegacyRef, forwardRef } from 'react';

export default forwardRef(function HorizontalScrollMode(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            className="tw-flex tw-flex-col controlsDemo__wrapper__padding-left controlsDemo_fixedWidth300"
            ref={ref}
        >
            <Container
                className="controlsDemo__height300"
                horizontalScrollMode="buttons"
                scrollOrientation={SCROLL_MODE.HORIZONTAL}
                buttonsSize="xl"
                buttonsViewMode="stretched"
            >
                <div className="controlsDemo_fixedWidth550">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                    voluptate velit cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                    laborum.
                </div>
            </Container>
        </div>
    );
});
