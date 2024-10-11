import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';

import { Model } from 'Types/entity';

import { IColumnConfig, IFooterConfig } from 'Controls/gridReact';
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

function getDefaultFooter(): IFooterConfig[] {
    return [
        {
            key: 'footer_1',
        },
        {
            key: 'footer_2',
            render: <i>Ячейка подвала</i>,
        },
        {
            key: 'footer_3',
            render: <i>Ячейка подвала</i>,
        },
    ];
}

function getFooterWithColspan(): IFooterConfig[] {
    return [
        {
            key: 'count',
            render: <i>Ячейка подвала на всю строку</i>,
            startColumn: 1,
            endColumn: 4,
        },
    ];
}

const VIRTUAL_SCROLL_CONFIG = {
    pageSize: 20,
};

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const [footer, setFooter] = React.useState<IFooterConfig[]>(getDefaultFooter());

    const setFooterWithColspan = () => {
        setFooter(getFooterWithColspan);
    };

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
            <button onClick={setFooterWithColspan}>Footer with colspan</button>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    itemActions={ACTIONS}
                    footer={footer}
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
