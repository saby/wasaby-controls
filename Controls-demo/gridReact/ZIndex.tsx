import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';
import 'Controls/masterDetail';

import { Model } from 'Types/entity';

import { IHeaderConfig, IColumnConfig, IResultConfig, IFooterConfig, useRenderData } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import { getItems } from './resources/CountriesData';

const RESULTS: IResultConfig[] = ['R1', 'R2', 'R3'].map((key) => ({
    key,
    render: <div>{key}</div>
}));

const FOOTER: IFooterConfig[] = ['F1', 'F2', 'F3'].map((key) => ({
    key,
    render: <div>{key}</div>
}));

const HEADER: IHeaderConfig[] = [
    {
        key: 'nom_header',
        caption: '#',
    },
    {
        key: 'country_name_header',
        caption: 'Страна',
    },
    {
        key: 'capital',
        caption: 'capital',
    },
];

const isColspaned = (item: Model) => [0, 1, 3, 5, 15].indexOf(item.getKey()) !== -1;

function ColspanRender(): JSX.Element {
    const { item } = useRenderData<Model>();

    if (isColspaned(item)) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{`Плановые отпуска + График смен (${item.getKey()})`}</>;
    } else {
        return <>{item.getKey()}</>;
    }
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
    },
    {
        key: 'capital',
        width: '500px',
        displayProperty: 'capital',
    }
];

const ACTIONS = getMoreActions();

const ITEMS = getItems();

function COLSPAN_CALLBACK(item: Model, column: IColumnConfig, columnIndex: number): 'end' | undefined {
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

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    header={HEADER}
                    columns={COLUMNS}
                    results={RESULTS}
                    resultsPosition='top'
                    stickyResults={true}
                    footer={FOOTER}
                    stickyFooter={true}
                    items={ITEMS}
                    colspanCallback={COLSPAN_CALLBACK}
                    virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
                    stickyMarkedItem
                    style={'master'}
                    itemActions={ACTIONS}
                    itemActionsVisibility={'onhover'}
                    itemActionsPosition={'outside'}
                    columnScroll={true}
                />
            </ScrollContainer>
        </div>
    );
});
