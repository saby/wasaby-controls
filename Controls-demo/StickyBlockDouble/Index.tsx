import { forwardRef, LegacyRef } from 'react';
import { Container } from 'Controls/scroll';
import { default as StickyBlockDouble } from 'Controls/StickyBlockDouble';

interface ILoremTextProps {
    count?: number;
}

function LoremText(props: ILoremTextProps) {
    const { count = 7 } = props;
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <p key={`index_${i}`} className="controls-margin_bottom-m">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            ))}
        </>
    );
}

export default forwardRef(function StickyBlockDoubleDemo(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="tw-flex">
            <Container className="controlsDemo__height500 controlsDemo_fixedWidth500 controls-margin_right-l">
                <div>
                    <StickyBlockDouble
                        className="controls-background-contrast-unaccented"
                        contentTemplate={
                            <div className="controlsDemo__height200 tw-flex tw-flex-col tw-justify-end controls-padding_left-m controls-padding_bottom-m">
                                Шапка
                            </div>
                        }
                        compactContentTemplate={
                            <div className="controls-padding_top-m controls-padding_bottom-m controls-padding_left-m">
                                Маленькая шапка
                            </div>
                        }
                    />
                    <LoremText />
                </div>
            </Container>

            <Container className="controlsDemo__height500 controlsDemo_fixedWidth500 controls-margin_left-l">
                <div>
                    <LoremText count={1} />
                    <StickyBlockDouble
                        className="controls-background-contrast-unaccented"
                        contentTemplate={
                            <div className="controlsDemo__height200 tw-flex tw-flex-col tw-justify-end controls-padding_left-m controls-padding_bottom-m">
                                Шапка
                            </div>
                        }
                        compactContentTemplate={
                            <div className="controls-padding_top-m controls-padding_bottom-m controls-padding_left-m">
                                Маленькая шапка
                            </div>
                        }
                    />
                    <LoremText />
                </div>
            </Container>
        </div>
    );
});
