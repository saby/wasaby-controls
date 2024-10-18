import * as React from 'react';

import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';

import { getColumns, getItems } from 'Controls-demo/gridReact/resources/Data';

export default React.forwardRef((_props, ref: React.ForwardedRef<HTMLDivElement>) => {
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
                markerVisibility={'visible'}
                multiSelectVisibility={'visible'}
            />
        </div>
    );
});
