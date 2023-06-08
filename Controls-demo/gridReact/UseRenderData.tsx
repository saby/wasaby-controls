import * as React from 'react';

import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig, useRenderData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { getItems } from 'Controls-demo/gridReact/resources/Data';

function getColumns(): IColumnConfig[] {
    return [
        {
            key: 'key',
            render: <KeyRender />,
        },
        {
            key: 'country',
            render: <CountryRender />,
        },
        { displayProperty: 'capital' },
    ];
}

// Проверяем что item - это рекорд
function KeyRender() {
    const { item } = useRenderData();
    return <div>{item.getKey()}</div>;
}

function CountryRender() {
    const {
        renderValues: { country },
    } = useRenderData(['country']);

    return <div>{country}</div>;
}

export default React.forwardRef(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);

        return (
            <div ref={ref}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    keyProperty="key"
                />
            </div>
        );
    }
);
