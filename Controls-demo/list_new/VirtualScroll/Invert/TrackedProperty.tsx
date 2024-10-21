import { type ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import type { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Container as ScrollContainer } from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { View as OperationsPanel } from 'Controls-ListEnv/operationsPanelConnected';
import { Memory } from 'Types/source';
import { Button } from 'Controls/buttons';
import { Invert as InvertAction } from 'Controls-ListEnv/actions';
import { default as Browser } from 'Layout/Browser';

import { generateData } from '../../DemoHelpers/DataCatalog';

import 'Controls-ListEnv/actions';

const virtualScrollConfig = { pageSize: 20 };

const displayProperty = 'title';
const keyProperty = 'key';
function getData(): { key: number; title: string; trackedVal: string }[] {
    return generateData<{
        key: number;
        title: string;
        trackedVal: string;
    }>({
        count: 100,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.trackedVal = `${item.key - (item.key % 10)}`;
            item.title = `Запись с id="${item.key}". `;
        },
    });
}
const createSource = () =>
    new Memory({
        keyProperty,
        data: getData(),
    });
const navigation = {
    source: 'page',
    view: 'infinity',
    sourceConfig: {
        pageSize: 40,
        page: 0,
        hasMore: false,
    },
};
const trackedProperties = ['trackedVal'];
const wasabySource = createSource();

function Page(_: object, ref: ForwardedRef<HTMLDivElement>) {
    const itemAction = useMemo(() => {
        return new InvertAction({
            id: 'invertAction',
            propStorageId: 'wasabyList',
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
            setTooltip(options.tooltip);
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
            className="controlsDemo__wrapper controlsDemo__flexRow controlsDemo_widthFit"
        >
            <div className="controlsDemo_fixedWidth500">
                <OperationsPanel storeId="VirtualScrollInvertTrackedProperty" />
                <ScrollContainer className="controlsDemo__height500">
                    <List
                        storeId="VirtualScrollInvertTrackedProperty"
                        name="list"
                        virtualScrollConfig={virtualScrollConfig}
                        trackedProperties={['trackedVal']}
                    />
                </ScrollContainer>
            </div>

            <div className="controlsDemo_fixedWidth500">
                <Button
                    icon={icon}
                    tooltip={tooltip}
                    onClick={invertActionClickHandler}
                    viewMode="ghost"
                    iconSize="m"
                />
                <Browser
                    useStore={true}
                    source={wasabySource}
                    navigation={navigation}
                    keyProperty={keyProperty}
                >
                    <ScrollContainer className="controlsDemo_fixedWidth500 controlsDemo__maxWidth500 controlsDemo__height500 controlsDemo__mb1">
                        <List
                            attr:class="demo-Grid__control test_grid_1"
                            displayProperty={displayProperty}
                            virtualScrollConfig={virtualScrollConfig}
                            trackedProperties={trackedProperties}
                        />
                    </ScrollContainer>
                </Browser>
            </div>
        </div>
    );
}

export default Object.assign(forwardRef(Page), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollInvertTrackedProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty,
                    source: createSource(),
                    navigation,
                    operationsPanelVisible: true,
                    listActions: [
                        {
                            actionName: 'Controls-ListEnv/actions:Invert',
                            storeId: 'VirtualScrollInvertTrackedProperty',
                        },
                    ],
                },
            },
        };
    },
});
