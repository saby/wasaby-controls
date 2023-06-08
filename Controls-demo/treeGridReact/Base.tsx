import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as TreeGridItemsView } from 'Controls/treeGrid';
import { IItemAction } from 'Controls/itemActions';

import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { getBaseColumns, getBaseRecordSet } from './Data';

const items = getBaseRecordSet();

const INITIAL_COLUMNS: IColumnConfig[] = getBaseColumns();

const ACTIONS: IItemAction[] = getMoreActions();

export default React.forwardRef(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const increaseAnisimAge = () => {
            const item = items.getRecordById(1);
            item.set('age', item.get('age') + 1);
        };

        return (
            <div ref={ref}>
                <button onClick={increaseAnisimAge}>
                    Increase Anisim's Age
                </button>

                <TreeGridItemsView
                    items={items}
                    columns={INITIAL_COLUMNS}
                    itemActions={ACTIONS}
                    root={null}
                    keyProperty={'key'}
                    nodeProperty={'type'}
                    parentProperty={'parent'}
                />
            </div>
        );
    }
);
