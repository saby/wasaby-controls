import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { source, sourceWithIcon, variants } from 'Controls-demo/dropdown_new/Open/Data';

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

export default function DropdownDemoFor({ viewMode }) {
    return variants.map((variant) => {
        return (
            <div key={`${variant.inlineHeight}_${variant.fontSize}_${variant.iconSize}`}>
                <div className="controls-text-label tw-flex tw-justify-center">
                    {`fontSize-${variant.fontSize} inlineHeight-${variant.inlineHeight} iconSize-${variant.iconSize}`}
                </div>
                <div className="tw-flex tw-justify-around">
                    <Buttons
                        viewMode={viewMode}
                        inlineHeight={variant.inlineHeight}
                        fontSize={variant.fontSize}
                        iconSize={variant.iconSize}
                    />
                </div>
            </div>
        );
    });
}

function Buttons({ viewMode, inlineHeight, fontSize, iconSize }) {
    return (
        <>
            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="1"
                    viewMode={viewMode}
                    keyProperty="key"
                    caption="Create1"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    iconSize={iconSize}
                    icon="icon-Add"
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="2"
                    viewMode={viewMode}
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create2"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    showHeader={false}
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="3"
                    viewMode={viewMode}
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create3"
                    icon="icon-Add"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    showHeader={false}
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="4"
                    viewMode={viewMode}
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create4"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="5"
                    viewMode={viewMode}
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create5"
                    source={sourceWithIcon}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    icon="icon-Add"
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="5"
                    viewMode={viewMode}
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    source={sourceWithIcon}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    icon="icon-Add"
                    className="controlsDemo-menuButton"
                />
            </div>
        </>
    );
}
