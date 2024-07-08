import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/DragNDrop/DragNDrop';
import { RecordSet } from 'Types/collection';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { HierarchicalMemory } from 'Types/source';
import * as Dnd from 'Controls/dragnDrop';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _itemsFirst: any = null;
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _dragStart(_: unknown, items: number[]): RecordSet {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title'),
            image: firstItem.get('image'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey ? target.getKey() : target;
        this._children.view.moveItems(
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
            DragNDrop: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    }
}
