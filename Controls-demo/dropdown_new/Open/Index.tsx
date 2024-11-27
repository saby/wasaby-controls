import * as React from 'react';
import { Button, Selector } from 'Controls/dropdown';
import { Memory } from 'Types/source';
import { ItemTemplate } from 'Controls/menu';
import 'css!Controls-demo/dropdown_new/Open/Index';

export default React.forwardRef((props, ref) => {
    const variants = [
        { fontSize: 'l', inlineHeight: 'l' },
        { fontSize: 'm', inlineHeight: 'm' },
    ];

    const source = new Memory({
        keyProperty: 'key',
        data: [
            { key: 1, title: 'Ярославль', icon: 'icon-Add' },
            { key: 2, title: 'Москва', icon: 'icon-Add' },
        ],
    });

    const source2 = new Memory({
        keyProperty: 'key',
        data: [
            { key: 1, title: 'Ярославль' },
            { key: 2, title: 'Москва' },
        ],
    });

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
            <h3 className="controls-text-label tw-flex tw-justify-center">Link Button</h3>
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
                            <LinkButtons
                                setRef={setRef}
                                source={source}
                                inlineHeight={variant.inlineHeight}
                                fontSize={variant.fontSize}
                            />
                        </div>
                    </div>
                );
            })}
            <h3 className="controls-text-label tw-flex tw-justify-center">Outlined Button</h3>
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
                            <OutlinedButtons
                                setRef={setRef}
                                source={source}
                                inlineHeight={variant.inlineHeight}
                                fontSize={variant.fontSize}
                            />
                        </div>
                    </div>
                );
            })}
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
                                source={source}
                                source2={source2}
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

function LinkButtons({ source, setRef, inlineHeight, fontSize, iconSize }) {
    return (
        <>
            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="1"
                    viewMode="link"
                    keyProperty="key"
                    caption="Create1"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    icon="icon-Add"
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    name="2"
                    viewMode="link"
                    ref={setRef}
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create2"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    className="controlsDemo-menuButton"
                    itemTemplate={(itemProps) => {
                        return (
                            <ItemTemplate
                                {...itemProps}
                                contentTemplate={(contentProps) => {
                                    return <div>{contentProps.itemData.item.get('title')}</div>;
                                }}
                            />
                        );
                    }}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="3"
                    viewMode="link"
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create3"
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
                    viewMode="link"
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create4"
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
                    name="5"
                    viewMode="link"
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create5"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    className="controlsDemo-menuButton"
                />
            </div>
        </>
    );
}

function OutlinedButtons({ source, setRef, inlineHeight, fontSize, iconSize }) {
    return (
        <>
            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="1"
                    viewMode="outlined"
                    keyProperty="key"
                    caption="Create1"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    icon="icon-Add"
                    className="controlsDemo-menuButton"
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    name="2"
                    viewMode="outlined"
                    ref={setRef}
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create2"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    className="controlsDemo-menuButton"
                    itemTemplate={(itemProps) => {
                        return (
                            <ItemTemplate
                                {...itemProps}
                                contentTemplate={(contentProps) => {
                                    return <div>{contentProps.itemData.item.get('title')}</div>;
                                }}
                            />
                        );
                    }}
                />
            </div>

            <div className="controlsDemo__cell controlsDemo_m3">
                <Button
                    ref={setRef}
                    name="3"
                    viewMode="outlined"
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create3"
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
                    viewMode="outlined"
                    keyProperty="key"
                    iconSize={iconSize}
                    caption="Create4"
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
                    name="5"
                    viewMode="outlined"
                    keyProperty="key"
                    iconSize={iconSize}
                    buttonStyle="primary"
                    caption="Create5"
                    source={source}
                    inlineHeight={inlineHeight}
                    fontSize={fontSize}
                    className="controlsDemo-menuButton"
                />
            </div>
        </>
    );
}

function Selectors({ source, source2, setRef, inlineHeight, fontSize, iconSize }) {
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
                    source={source2}
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
                    source={source2}
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
