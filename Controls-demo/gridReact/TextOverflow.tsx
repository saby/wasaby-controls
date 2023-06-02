import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';

export function getItems(): RecordSet {
    return new RecordSet({
        rawData: [
            {
                key: 0,
                number: 1,
                title: 'Очень длинная строка очень преочень длинная строка, проверяем как работает перенос текста на новую строку',
            },
            {
                key: 1,
                number: 2,
                title: 'Очень длинная строка очень преочень длинная строка, проверяем как работает обрезание текста',
            },
        ],
        keyProperty: 'key',
    });
}

export function getColumns(): IColumnConfig[] {
    return [
        { displayProperty: 'number', width: '50px' },
        {
            displayProperty: 'title',
            width: '200px',
            getCellProps: (item: Model) => {
                if (item.getKey() === 0) {
                    return {
                        textOverflow: 'none',
                    };
                }
                if (item.getKey() === 1) {
                    return {
                        textOverflow: 'ellipsis',
                    };
                }
            },
        },
    ];
}

export default React.forwardRef(
    (_: object, ref: React.ForwardedRef<HTMLDivElement>) => {
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
    }
);
