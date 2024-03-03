import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';

import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import { getItems, getItemsWithItemActions } from 'Controls-demo/gridReact/resources/CountriesData';

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
    },
    {
        key: 'country',
        width: '1fr',
        displayProperty: 'country',
    },
    {
        key: 'capital',
        width: '250px',
        displayProperty: 'capital',
    },
];

const ITEMS = getItemsWithItemActions();

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const getRowProps = React.useCallback(() => {
        return {};
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    itemActionsProperty={'itemActions'}
                    itemActionsVisibility={'delayed'}
                    itemActionsPosition={'inside'}
                    getRowProps={getRowProps}
                    customEvents={['onActionClick']}
                />
            </ScrollContainer>
        </div>
    );
});