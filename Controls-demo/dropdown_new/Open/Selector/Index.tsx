import * as React from 'react';
import { Selector } from 'Controls/dropdown';
import { source, sourceWithoutIcons } from '../Data';
import 'css!Controls-demo/dropdown_new/Open/Index';

export default React.forwardRef((props, ref) => {
    const variants = [
        { fontSize: 'l', inlineHeight: 'l' },
        { fontSize: 'm', inlineHeight: 'm' },
    ];

    const setRef = (node) => {
        node.openMenu(
            {
                templateOptions: {},
                eventHandlers: {},
            },
            '',
            1
        );
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <h3 className="controls-text-label tw-flex tw-justify-center">Selector</h3>

            {variants.map((variant, key) => {
                return (
                    <div key={variant.fontSize}>
                        <div className="controls-text-label tw-flex tw-justify-center">
                            {'fontSize-' +
                                variant.fontSize +
                                ' inlineHeight-' +
                                variant.inlineHeight}
                        </div>
                        <div className="tw-flex tw-justify-around">
                            <Selectors
                                setRef={setRef}
                                inlineHeight={variant.inlineHeight}
                                fontSize={variant.fontSize}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

function Selectors({ setRef, inlineHeight, fontSize, iconSize }) {
    return (
        <>
            <div className="controlsDemo__cell controlsDemo_m3">
                <Selector
                    ref={setRef}
                    name="7"
                    source={source}
                    displayProperty="title"
                    keyProperty="key"
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    iconSize={iconSize}
                    menuHeadingCaption="Город"
                    selectedKeys={[1]}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Selector
                    ref={setRef}
                    name="8"
                    source={sourceWithoutIcons}
                    displayProperty="title"
                    keyProperty="key"
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    iconSize={iconSize}
                    selectedKeys={[1]}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Selector
                    ref={setRef}
                    name="9"
                    source={sourceWithoutIcons}
                    displayProperty="title"
                    keyProperty="key"
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    iconSize={iconSize}
                    menuHeadingCaption="Город"
                    selectedKeys={[1]}
                />
            </div>
        </>
    );
}
