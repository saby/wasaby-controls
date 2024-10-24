import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getItems } from 'Controls-demo/gridReact/resources/CountriesData';

function CountryComponent(props) {
    return <div style={{ height: '100px' }}>Kirill</div>;
}

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
    },
    {
        key: 'country',
        width: '1fr',
        render: <CountryComponent />,
    },
    {
        key: 'capital',
        width: '250px',
        displayProperty: 'capital',
    },
];

const ITEMS = getItems(2);

const itemActions = [
    {
        id: 0,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: 1,
    },
    {
        id: 1,
        icon: 'icon-DK',
        title: 'Расчеты по документу',
        showType: 1,
    },
];

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <GridView
                columns={COLUMNS}
                items={ITEMS}
                itemActions={itemActions}
                actionAlignment={'vertical'}
                actionCaptionPosition={'right'}
            />
        </div>
    );
});
