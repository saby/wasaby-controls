import { Model, Record, adapter } from 'Types/entity';
import { Meta } from 'Meta/types';
import { StackTemplate } from 'Controls-editors/_recordset/components/StackTemplate';
import {
    MAX_STACK_WIDTH,
    MIN_STACK_WIDTH,
    SEARCH_PARAM,
} from 'Controls-editors/_recordset/constants';
import { Memory, MemoryFilterFunction } from 'Types/source';
import { IObjectKey } from 'Types/object';
import { IOpenStackParams } from 'Controls-editors/_recordset/interface';

export function openStack<T>(params: IOpenStackParams<T>) {
    const { stack, templateOptions, opener, onClose } = params;
    stack.open({
        template: StackTemplate,
        templateOptions: {
            ...templateOptions,
        },
        eventHandlers: {
            onClose,
        },
        propStorageId: 'recordset_editor_stack_id',
        width: 'e',
        minWidth: MIN_STACK_WIDTH,
        maxWidth: MAX_STACK_WIDTH,
        closeOnOutsideClick: true,
        autofocus: false,
        opener,
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
