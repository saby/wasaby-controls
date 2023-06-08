import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/DragNDropWithTile/DragNDropWithTile';
import * as ListEntity from 'Controls-demo/DragNDrop/ListEntity';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Gadgets;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Gadgets.getColumns();
    protected _selectedKeys: Number[] = [];
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);
    private _multiselect: 'visible' | 'hidden' = 'hidden';
    private _items: RecordSet;

    private _itemsReady(items: RecordSet): void {
        this._items = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): void {
        let hasBadItems = false;
        const firstItem = this._items.getRecordById(items[0]);

        items.forEach((item: unknown): ListEntity => {
            if (item === 0) {
                hasBadItems = true;
            }
        });
        return hasBadItems
            ? false
            : new ListEntity({
                  items,
                  mainText: firstItem.get('title'),
                  image: firstItem.get('image'),
                  additionalText: firstItem.get('additional'),
              });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        const targetKey = target?.getKey?.() || target;
        // eslint-disable-next-line
        this._children.explorer.moveItems({
            selected: entity.getItems(),
            excluded: []
        }, targetKey, position);
    }

    protected _onToggle(): void {
        this._multiselect = this._multiselect === 'visible' ? 'hidden' : 'visible';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    root: null,
                    viewMode: 'tile',
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'hidden',
                },
            },
        };
    }
}
