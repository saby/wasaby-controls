import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';

import { Model } from 'Types/entity';

import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import { getItems } from 'Controls-demo/gridReact/resources/CountriesData';
import { IItemAction } from 'Controls/interface';

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

const ACTIONS = getMoreActions();

const ITEMS = getItems();

const VIRTUAL_SCROLL_CONFIG = {
    pageSize: 20,
};

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const onActionClick = React.useCallback((action: IItemAction, model: Model) => {
        if (action.id === 10) {
            // 10 is remove action
            ITEMS.remove(model);
        }
    }, []);

    const getRowProps = React.useCallback(() => {
        return {};
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    itemActions={ACTIONS}
                    itemActionsVisibility={'onhover'}
                    itemActionsPosition={'outside'}
                    getRowProps={getRowProps}
                    onActionClick={onActionClick}
                    customEvents={['onActionClick']}
                />
            </ScrollContainer>
        </div>
    );
});
