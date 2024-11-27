import { type ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import type { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Container as ScrollContainer } from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { View as OperationsPanel } from 'Controls-ListEnv/operationsPanelConnected';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { Button } from 'Controls/buttons';
import { Invert as InvertAction } from 'Controls-ListEnv/actions';
import { default as Browser } from 'Layout/Browser';

import 'Controls-ListEnv/actions';

const virtualScrollConfig = { pageSize: 35 };
function getData() {
    return generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
    });
}
const keyProperty = 'key';
const displayProperty = 'title';
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
const multiSelectVisibility = 'visible';

const wasabySource = createSource();

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
                <OperationsPanel storeId="VirtualScrollInvertCheckboxes" />
                <ScrollContainer className="controlsDemo__height500">
                    <List
                        storeId="VirtualScrollInvertCheckboxes"
                        name="list"
                        virtualScrollConfig={virtualScrollConfig}
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
                            multiSelectVisibility={multiSelectVisibility}
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
            VirtualScrollInvertCheckboxes: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty,
                    source: createSource(),
                    navigation,
                    operationsPanelVisible: true,
                    listActions: [
                        {
                            actionName: 'Controls-ListEnv/actions:Invert',
                            storeId: 'VirtualScrollInvertCheckboxes',
                        },
                    ],
                    multiSelectVisibility,
                },
            },
        };
    },
});
