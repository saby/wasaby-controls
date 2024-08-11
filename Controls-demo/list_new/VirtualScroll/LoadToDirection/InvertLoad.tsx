import { type ForwardedRef, forwardRef, useCallback, useMemo, useEffect, useState } from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { View as Toolbar } from 'Controls/toolbars';

import { default as Browser } from 'Layout/Browser';
import { Button } from 'Controls/buttons';
import { Invert as InvertAction } from 'Controls-ListEnv/actions';

import 'Controls-ListEnv/actions';

import {
    listActions,
    LoadConfig,
    virtualScrollConfig,
    wasabyListSource,
    wasabyInitNavigation,
} from './constants';

function Page(_: object, ref: ForwardedRef<HTMLDivElement>) {
    const itemAction = useMemo(() => {
        return new InvertAction({
            id: 'invertAction',
        });
    }, []);
    const invertActionClickHandler = useCallback(() => {
        itemAction.execute();
    }, [itemAction]);
    const [icon, setIcon] = useState(itemAction.icon);
    const [tooltip, setTooltip] = useState(itemAction.tooltip);
    const updateInvertButton = useCallback(
        (event, options) => {
            setIcon(options.icon);
            setTooltip(options.tootip);
        },
        [setIcon, setTooltip]
    );
    useEffect(() => {
        itemAction.subscribe('itemChanged', updateInvertButton);
        return () => {
            itemAction.unsubscribe('itemChanged', updateInvertButton);
        };
    }, [itemAction, updateInvertButton]);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth1200"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}
        >
            <div>
                <div className="demo-VirtualScroll__title controls-text-label controls-fontsize-l controlsDemo__mb1">
                    Список на прикладном слайсе
                </div>

                <ToolbarContainer storeId="VirtualScrollLoadToDirection" actions={listActions}>
                    <Toolbar direction="horizontal" />
                </ToolbarContainer>
                <ScrollContainer className="controlsDemo_fixedWidth500 controlsDemo__maxWidth500 controlsDemo__height500 controlsDemo__mb1">
                    <List
                        storeId="VirtualScrollLoadToDirection"
                        name="list"
                        virtualScrollConfig={virtualScrollConfig}
                    />
                </ScrollContainer>
            </div>
            <div>
                <div className="demo-VirtualScroll__title controls-text-label controls-fontsize-l controlsDemo__mb1">
                    Список на чистых опциях
                </div>
                <Button
                    icon={icon}
                    tooltip={tooltip}
                    onClick={invertActionClickHandler}
                    viewMode="ghost"
                    iconSize="m"
                />
                <Browser
                    keyProperty={'key'}
                    source={wasabyListSource}
                    navigation={wasabyInitNavigation}
                    useStore={true}
                >
                    <ScrollContainer className="controlsDemo_fixedWidth500 controlsDemo__maxWidth500 controlsDemo__height500 controlsDemo__mb1">
                        <List
                            attr:class="demo-Grid__control test_grid_1"
                            displayProperty="title"
                            virtualScrollConfig={virtualScrollConfig}
                        />
                    </ScrollContainer>
                </Browser>
            </div>

            <div>
                <div className="demo-VirtualScroll__title controls-text-label controls-fontsize-l controlsDemo__mb1">
                    Список на синтетическом слайсе
                </div>
                <ScrollContainer className="controlsDemo_fixedWidth500 controlsDemo__maxWidth500 controlsDemo__height500 controlsDemo__mb1">
                    <List
                        name="list"
                        keyProperty={'key'}
                        displayProperty="title"
                        source={wasabyListSource}
                        navigation={wasabyInitNavigation}
                        virtualScrollConfig={virtualScrollConfig}
                    />
                </ScrollContainer>
            </div>
        </div>
    );
}

export default Object.assign(forwardRef(Page), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return LoadConfig;
    },
});
