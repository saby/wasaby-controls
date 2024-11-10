import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { getItems } from 'Controls-demo/gridReact/resources/Data';

function getColumns(): IColumnConfig[] {
    return [
        { key: 'country', displayProperty: 'country' },
        { displayProperty: 'capital' },
    ];
}

export default React.forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [items, setItems] = React.useState(getItems());
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);

    const updateItems = () => {
        const newItems = getItems();
        newItems.forEach((it) => {
            it.set('country', `${it.get('country')}(changed)`);
        });
        setItems(newItems);
    };

    return (
        <div ref={ref}>
            <GridItemsView items={items} columns={columns} keyProperty="key" />
            <button data-qa={'update-items'} onClick={updateItems}>Update items</button>
        </div>
    );
});
