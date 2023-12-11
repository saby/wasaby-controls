import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/DragNDrop/DragNDrop';
import * as FirstColumn from 'wml!Controls-demo/gridNew/EditInPlace/DragNDrop/FirstColumn';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { Collection, TColspanCallbackResult } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { TItemsReadyCallback } from '../../../types';
import { Ports } from 'Controls-demo/gridNew/DemoHelpers/Data/Ports';
import { ItemsEntity } from 'Controls/dragnDrop';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Ports.getData().map((cur) => {
        return ((data) => {
            for (const key in data) {
                if (data[key]) {
                    data[key] = '' + data[key];
                } else {
                    data[key] = '';
                }
            }
            return data;
        })(cur);
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Ports.getColumnsDND();
    protected selectedKey: number = 1;
    private _itemsFirst: RecordSet = null;
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);

    protected _beforeMount(): void {
        this._columns[0].template = FirstColumn;
    }

    private onChange = (_: SyntheticEvent, name: string, item: Model, value: number): void => {
        item.set(name, value);
    };

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): ItemsEntity {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new ItemsEntity({
            items,
            title: firstItem.get('title'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey ? target.getKey() : target;
        this._children.grid.moveItems(
            {
                selected: entity.getItems(),
                excluded: [],
            },
            targetKey,
            position
        );
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceDragNDrop: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
