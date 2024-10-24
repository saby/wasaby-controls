import { type ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import type { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Container as ScrollContainer } from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { View as OperationsPanel } from 'Controls-ListEnv/operationsPanelConnected';
import { Invert as InvertAction } from 'Controls-ListEnv/actions';
import { Button } from 'Controls/buttons';
import { default as Browser } from 'Layout/Browser';

import 'Controls-ListEnv/actions';
import PositionSourceMock from './PositionSourceMock';

const virtualScrollConfig = { pageSize: 20 };

const keyProperty = 'key';
const displayProperty = 'title';
const createSource = () =>
    new PositionSourceMock({
        keyProperty,
    });

const navigation = {
    source: 'position',
    view: 'infinity',
    sourceConfig: {
        field: 'key',
        position: 50,
        direction: 'bothways',
        limit: 40,
    },
    viewConfig: {
        pagingMode: 'edges',
        resetButtonMode: 'day',
        _date: '50',
    },
};
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
                <OperationsPanel storeId="VirtualScrollInvertNavigationButtons" />
                <ScrollContainer className="controlsDemo__height500">
                    <List
                        storeId="VirtualScrollInvertNavigationButtons"
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
            VirtualScrollInvertNavigationButtons: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty,
                    source: createSource(),
                    navigation,
                    operationsPanelVisible: true,
                    listActions: [
                        {
                            actionName: 'Controls-ListEnv/actions:Invert',
                            storeId: 'VirtualScrollInvertNavigationButtons',
                        },
                    ],
                },
            },
        };
    },
});
