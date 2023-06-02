import * as React from 'react';

import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig, IGridProps } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';

import { getMoreActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { useRowPropsEditor } from './Editors/RowPropsEditor';
import { useColumnsEditor } from './Editors/ColumnsEditor';
import { useGridPropsEditor } from './Editors/GridPropsEditor';

const items = new RecordSet({
    rawData: [
        { key: 1, firstName: 'Анисим', lastName: 'Веселков', age: 30 },
        { key: 2, firstName: 'Евлампия', lastName: 'Гронская', age: 23 },
        { key: 3, firstName: 'Эвелина', lastName: 'Никифорова', age: 55 },
        { key: 4, firstName: 'Юлия', lastName: 'Абрамович', age: 18 },
        { key: 5, firstName: 'Радим', lastName: 'Симонов', age: 25 },
    ],
    keyProperty: 'key',
});

const INITIAL_COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '30px',
    },
    {
        key: 'firstName',
        displayProperty: 'firstName',
    },
    {
        key: 'age',
        displayProperty: 'age',
        width: '50px',
    },
];

const ACTIONS: IItemAction[] = getMoreActions();

const INITIAL_GRID_PROPS: Partial<IGridProps> = {
    keyProperty: 'key',
    itemActions: ACTIONS,
};

export default React.forwardRef(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const increaseAnisimAge = () => {
            const item = items.getRecordById(1);
            item.set('age', item.get('age') + 1);
        };

        const { gridPropsEditor, gridProps } =
            useGridPropsEditor(INITIAL_GRID_PROPS);
        const { rowPropsEditor, getRowProps } = useRowPropsEditor();
        const { columnsEditor, columns } = useColumnsEditor(INITIAL_COLUMNS);

        return (
            <div ref={ref} className={'controlsDemo__wrapper'}>
                <button onClick={increaseAnisimAge}>
                    Increase Anisim's Age
                </button>

                {gridPropsEditor}
                {rowPropsEditor}
                {columnsEditor}

                <GridItemsView
                    items={items}
                    columns={columns}
                    getRowProps={getRowProps}
                    {...gridProps}
                />
            </div>
        );
    }
);
