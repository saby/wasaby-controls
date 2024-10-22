import { type ForwardedRef, forwardRef, useMemo } from 'react';
import type {
    INavigationOptionValue,
    INavigationPositionSourceConfig,
} from 'Controls/_interface/INavigation';
import type { IDataConfig, IListDataFactoryArguments, ListSlice } from 'Controls/dataFactory';

import {
    Container as ScrollContainer,
    SCROLL_POSITION,
    IInitialScrollPosition,
} from 'Controls/scroll';
import { View as List } from 'Controls/list';
import { View as OperationsPanel } from 'Controls-ListEnv/operationsPanelConnected';
import PositionSourceMock from './PositionSourceMock';

import 'Controls-ListEnv/actions';
import { useSlice } from 'Controls-DataEnv/context';

function getNavigation(position: number): INavigationOptionValue<INavigationPositionSourceConfig> {
    return {
        source: 'position',
        view: 'infinity',
        sourceConfig: {
            field: 'key',
            position,
            direction: 'bothways',
            limit: 35,
        },
    };
}
const virtualScrollConfig = { pageSize: 35 };

function Page(_: object, ref: ForwardedRef<HTMLDivElement>) {
    const slice = useSlice('VirtualScrollInvert') as ListSlice;
    const initialScrollPosition: IInitialScrollPosition = useMemo(() => {
        if (slice.state.itemsOrder && slice.state.itemsOrder !== 'default') {
            return {
                vertical: SCROLL_POSITION.END,
                horizontal: SCROLL_POSITION.START,
            };
        } else {
            return {
                vertical: SCROLL_POSITION.START,
                horizontal: SCROLL_POSITION.START,
            };
        }
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <OperationsPanel storeId="VirtualScrollInvert" />
            <ScrollContainer
                className="controlsDemo__height500"
                initialScrollPosition={initialScrollPosition}
            >
                <List
                    storeId="VirtualScrollInvert"
                    name="list"
                    virtualScrollConfig={virtualScrollConfig}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(forwardRef(Page), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollInvert: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PositionSourceMock({
                        keyProperty: 'key',
                    }),
                    navigation: getNavigation(0),
                    operationsPanelVisible: true,
                    listActions: [
                        {
                            actionName: 'Controls-ListEnv/actions:Invert',
                            storeId: 'VirtualScrollInvert',
                        },
                    ],
                    itemsOrder: 'reverse',
                },
            },
        };
    },
});
