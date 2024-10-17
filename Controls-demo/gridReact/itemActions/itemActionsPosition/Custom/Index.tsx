import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';

import { Model } from 'Types/entity';

import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { ActionsConnectedComponent } from 'Controls/list';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import { getItems } from 'Controls-demo/gridReact/resources/CountriesData';
import { IItemAction } from 'Controls/interface';

const isColspaned = (item: Model) => [0, 1, 3, 5, 15].indexOf(item.getKey()) !== -1;

function ColspanRender(): JSX.Element {
    const { item } = useItemData<Model>();

    return isColspaned(item) ? (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {`Плановые отпуска + График смен (${item.getKey()})`}
            <ActionsConnectedComponent />
        </>
    ) : (
        item.getKey()
    );
}

function CountryRender(): JSX.Element {
    const { item } = useItemData<Model>();

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {item.get('country')}
            <ActionsConnectedComponent />
        </>
    );
}

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
        render: <ColspanRender />,
    },
    {
        key: 'country',
        width: '500px',
        displayProperty: 'country',
        render: <CountryRender />,
    },
    {
        key: 'capital',
        width: '500px',
        displayProperty: 'capital',
    },
];

const ACTIONS = getMoreActions();

const ITEMS = getItems();

function COLSPAN_CALLBACK(
    item: Model,
    column: IColumnConfig,
    columnIndex: number
): 'end' | undefined {
    if (columnIndex === 0 || columnIndex === 1) {
        if (isColspaned(item) && columnIndex === 0) {
            return 'end';
        }
    }
}

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

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    colspanCallback={COLSPAN_CALLBACK}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    itemActions={ACTIONS}
                    itemActionsVisibility={'onhover'}
                    itemActionsPosition={'custom'}
                    columnScroll={true}
                    onActionClick={onActionClick}
                    customEvents={['onActionClick']}
                />
            </ScrollContainer>
        </div>
    );
});
