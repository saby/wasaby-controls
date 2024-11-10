import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import 'Controls/gridReact';
import { Text } from 'Controls/input';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { IEditingConfig } from 'Controls/display';

import { getItems } from 'Controls-demo/gridReact/resources/Data';
import { isRequired } from 'Controls/validate';
import { InputContainer } from 'Controls/validate';

function CountryRender(): JSX.Element {
    const { renderValues, item } = useItemData<Model>(['country']);
    return <div>{renderValues.country}</div>;
}

function EditCell(props: { property: string }) {
    const property = props.property;
    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (_, value) => {
            return item.set(property, value);
        },
        [item]
    );

    return (
        <InputContainer
            validators={[() => isRequired({ value: String(renderValues[property]) })]}
            value={String(renderValues[property])}
            onValueChanged={onValueChanged}
            content={Text}
        />
    );
}

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
            render: <CountryRender />,
            editorRender: <EditCell property={'country'} />,
        },
    ];
}

interface IProps {
    editingMode?: 'row' | 'cell';
    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';
    inputBorderVisibility?: 'partial' | 'hidden';
}

export default React.forwardRef((props: IProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const items = React.useMemo<RecordSet>(() => {
        return getItems();
    }, []);

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns();
    }, []);

    const editingConfig = React.useMemo<IEditingConfig>(() => {
        return {
            editOnClick: true,
            toolbarVisibility: true,
            mode: 'row',
            inputBackgroundVisibility: 'visible',
        };
    }, []);

    return (
        <div ref={ref}>
            <GridItemsView items={items} columns={columns} editingConfig={editingConfig} />
        </div>
    );
});
