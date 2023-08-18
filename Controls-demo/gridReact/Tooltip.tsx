import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';

import { getColumns as getDefaultColumns, getItems } from 'Controls-demo/gridReact/resources/Data';

function getColumns(): IColumnConfig[] {
    const columns = getDefaultColumns();
    columns[1].getCellProps = (item: Model) => {
        return {
            tooltip: item.get('country'),
        };
    };
    return columns;
}

export default React.forwardRef((_: object, ref: React.ForwardedRef<HTMLDivElement>) => {
    const items = React.useMemo<RecordSet>(() => {
        return getItems();
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);

    return (
        <div ref={ref}>
            <GridItemsView items={items} columns={columns} />
        </div>
    );
});
