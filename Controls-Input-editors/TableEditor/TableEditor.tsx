import { NameEditor } from 'Controls-Input-editors/NameEditor/NameEditor';
import Columns, { IColumn } from 'Controls-Input-editors/TableEditor/Columns';
import React = require('react');
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { memo, Fragment } from 'react';
import { IEditorLayoutProps } from 'Controls-editors/object-type';

interface ITableProps {
    name: string;
    columns: IColumn[];
}

interface ITableEditor extends IPropertyEditorProps<ITableProps> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

export const TableEditor = memo((props: ITableEditor) => {
    const { value, LayoutComponent = Fragment, type } = props;

    function propertyChanged(valueName: string, data: unknown): void {
        props.onChange?.({
            name: value.name,
            columns: valueName === 'name' && data !== value.name ? [] : value.columns,
            [valueName]: data,
        });
    }

    return (
        <LayoutComponent title={null}>
            <NameEditor
                value={value.name}
                onChange={(data) => propertyChanged('name', data)}
                type={type}
                LayoutComponent={LayoutComponent}
            ></NameEditor>
            {value.name && (
                <Columns
                    tableName={value.name}
                    columns={value.columns}
                    onChange={(data) => propertyChanged('columns', data)}
                    LayoutComponent={LayoutComponent}
                ></Columns>
            )}
        </LayoutComponent>
    );
});
