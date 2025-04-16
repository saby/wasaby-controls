import { Model, Record, adapter } from 'Types/entity';
import { Meta, ObjectMeta } from 'Meta/types';
import { StackTemplate } from 'Controls-editors/_recordset/components/StackTemplate';
import { SEARCH_PARAM } from 'Controls-editors/_recordset/constants';
import { Memory, MemoryFilterFunction } from 'Types/source';
import { IObjectKey } from 'Types/object';
import { IOpenStackParams } from 'Controls-editors/_recordset/interface';
import { TColumns, IColumnConfig } from 'Controls/grid';
import { Variant } from 'Controls-editors/_recordset/components/render/Variant';
import { Enum } from 'Controls-editors/_recordset/components/render/Enum';
import * as React from 'react';
import { ReactElement } from 'react';

export function openStack<T>(params: IOpenStackParams<T>) {
    const { stack, templateOptions, onClose } = params;
    stack.open({
        template: StackTemplate,
        templateOptions: {
            ...templateOptions,
        },
        eventHandlers: {
            onClose,
        },
    });
}

export function filterItem(
    value: string,
    item: Model,
    properties: Record<string, Meta<unknown>>
): boolean {
    if (!value) {
        return true;
    }
    const attrs = Object.getOwnPropertyNames(properties);
    let includes = false;
    for (let i = 0; i < attrs.length; i++) {
        const property = attrs[i];
        const itemProperty = item.get(property);
        if (
            typeof itemProperty === 'string' &&
            itemProperty.toUpperCase().includes(value.toUpperCase())
        ) {
            includes = true;
            break;
        }
    }
    return includes;
}

export function getViewConfig(
    data: unknown,
    keyProperty: IObjectKey,
    adapter?: adapter.IAdapter,
    filter?: MemoryFilterFunction
) {
    return {
        recordsetEditorView: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty,
                    data,
                    adapter,
                    filter,
                }),
                searchParam: SEARCH_PARAM,
                markerVisibility: 'hidden',
            },
        },
    };
}

function getColumnDefaultRender(type: string, column: IColumnConfig): ReactElement | null {
    switch (type) {
        case 'variant':
            return React.createElement(Variant, { displayProperty: column.displayProperty });
        case 'enum':
            return React.createElement(Enum, { displayProperty: column.displayProperty });
        default:
            return null;
    }
}

export function prepareColumns<T>(
    metaType: ObjectMeta<T>,
    displayProperties?: string[],
    columns?: TColumns
): TColumns {
    let result: TColumns = [];
    const properties = metaType.getProperties();
    if (!columns) {
        const names = Object.getOwnPropertyNames(properties);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (!displayProperties || displayProperties.includes(name)) {
                const column: IColumnConfig = {
                    displayProperty: name,
                };
                const render = getColumnDefaultRender(properties[name].getBaseType(), column);
                if (render) {
                    column.render = render;
                }
                result.push(column);
            }
        }
    } else {
        result = columns;
        for (let i = 0; i < result.length; i++) {
            const column: IColumnConfig = result[i];
            if (!column.render && !column.template) {
                const render = getColumnDefaultRender(
                    properties[column.displayProperty].getBaseType(),
                    column
                );
                if (render) {
                    column.render = render;
                }
            }
        }
    }
    return result;
}
