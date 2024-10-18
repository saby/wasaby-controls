import { forwardRef, useState } from 'react';
import { StickyBlock } from 'Controls/stickyBlock';
import { Container } from 'Controls/scroll';
import { Switch } from 'Controls/toggle';
import { Button } from 'Controls/buttons';

function Content() {
    return (
        <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
            aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum.
        </div>
    );
}

export default forwardRef(function ResizeScroll(_, ref) {
    const [value, setValue] = useState(true);
    const [hasContent, setHasContent] = useState(false);
    return (
        <div className="tw-flex" ref={ref}>
            <div className="options-wrap">
                <Switch
                    className="controlsDemo__ml2"
                    caption="Изначальное наличие скрола"
                    value={value}
                    onValueChanged={(res) => {
                        setValue(res);
                        setHasContent(false);
                    }}
                    customEvents={['onValueChanged']}
                />
                <Container
                    className="controlsDemo__ml2 controlsDemo_fixedWidth300 controlsDemo__height300"
                    scrollOrientation="vertical"
                >
                    <div>
                        {value ? (
                            <>
                                <StickyBlock
                                    position="top"
                                    className="tw-w-full controls-background-unaccented"
                                >
                                    <div className="controls-padding-s">
                                        StickyBlock, position = top
                                    </div>
                                </StickyBlock>
                                <Content />
                            </>
                        ) : (
                            <>
                                <StickyBlock
                                    position="top"
                                    className="tw-w-full controls-background-unaccented"
                                >
                                    <div className="controls-padding-s">
                                        StickyBlock, position = top
                                    </div>
                                </StickyBlock>
                                content 1
                                {hasContent ? (
                                    <Content />
                                ) : (
                                    <Button
                                        caption="Добавить контент"
                                        onClick={() => {
                                            setHasContent(true);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
});
