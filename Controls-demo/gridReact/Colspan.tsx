import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';

import { getItems } from 'Controls-demo/gridReact/resources/Data';

function getColumns(): IColumnConfig[] {
    return [
        {
            key: 0,
            displayProperty: 'number',
            width: '50px',
        },
        {
            key: 1,
            displayProperty: 'country',
        },
        {
            key: 2,
            displayProperty: 'capital',
        },
    ];
}

export default React.forwardRef(
    (_: unknown, ref: React.ForwardedRef<HTMLDivElement>) => {
        const items = React.useMemo<RecordSet>(() => {
            return getItems();
        }, []);
        const columns = React.useMemo<IColumnConfig[]>(() => {
            return getColumns();
        }, []);
        const colspanCallback = React.useCallback(
            (
                item: Model,
                column: IColumnConfig,
                columnIndex: number,
                isEditing: boolean
            ) => {
                if (item.getKey() === 0 && columnIndex === 0) {
                    return 'end';
                }
                if (item.getKey() === 1 && columnIndex === 0) {
                    return 2;
                }
                if (item.getKey() === 2 && columnIndex === 1) {
                    return 2;
                }
            },
            []
        );

        return (
            <div ref={ref}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    colspanCallback={colspanCallback}
                />
            </div>
        );
    }
);
