import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text as TextInput } from 'Controls/input';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { IEditingConfig } from 'Controls/display';

import { getItems } from 'Controls-demo/gridReact/resources/Data';

function PropertyEditor(props: { property: string }) {
    const { property } = props;
    const { item, renderValues } = useItemData<Model>([property]);

    const onValueChanged = React.useCallback(
        (value) => {
            return item.set(property, value);
        },
        [item, property]
    );
    return (
        <TextInput
            value={String(renderValues[property])}
            className={'tw-w-full'}
            contrastBackground
            onValueChanged={onValueChanged}
            customEvents={['onValueChanged']}
        />
    );
}

function RowEditor() {
    return (
        <div data-qa={'custom-row-editor'}>
            <PropertyEditor property={'number'} />
            <PropertyEditor property={'country'} />
            <PropertyEditor property={'capital'} />
        </div>
    );
}

function getColumns(): IColumnConfig[] {
    return [
        {
            key: 0,
            displayProperty: 'number',
            width: '50px',
            editorRender: <RowEditor />,
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

export default React.forwardRef((_: unknown, ref: React.ForwardedRef<HTMLDivElement>) => {
    const items = React.useMemo<RecordSet>(() => {
        return getItems();
    }, []);
    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);
    const editingConfig = React.useMemo<IEditingConfig>(() => {
        return {
            editOnClick: true,
            mode: 'row',
        };
    }, []);
    const colspanCallback = React.useCallback(
        (item: Model, column: IColumnConfig, columnIndex: number, isEditing: boolean) => {
            if (isEditing) {
                return 'end';
            }
        },
        []
    );

    return (
        <div ref={ref}>
            <GridItemsView
                items={items}
                columns={columns}
                editingConfig={editingConfig}
                colspanCallback={colspanCallback}
            />
        </div>
    );
});
