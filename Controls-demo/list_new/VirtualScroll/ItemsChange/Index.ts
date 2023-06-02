import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/ItemsChange/ItemsChange';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';

interface IItem {
    key: number;
    title: string;
}

type IEdge = 'start' | 'end';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _source: Memory;
    protected _multiSelectVisibility: string = 'hidden';
    private _items: RecordSet;
    private _newItemsOrderNumber: number = 99;
    private _dataArray: IItem[] = generateData<IItem>({
        count: 100,
        entityTemplate: { title: 'number' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись #${item.key}`;
        },
    });

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }

    private _itemsReadyCallback = (items: RecordSet): void => {
        this._items = items;
    };

    protected _addItem(event: Event, edge: IEdge): void {
        this._newItemsOrderNumber++;
        this._items[edge === 'start' ? 'prepend' : 'append'](
            new RecordSet({
                rawData: [
                    {
                        key: this._newItemsOrderNumber,
                        title: `Новая запись #${this._newItemsOrderNumber}`,
                    },
                ],
            })
        );
    }

    protected _removeItem(event: Event, edge: IEdge): void {
        this._items.removeAt(edge === 'start' ? 0 : this._items.getCount() - 1);
    }
    protected _changeMultiSelect(): void {
        this._multiSelectVisibility =
            this._multiSelectVisibility === 'hidden' ? 'visible' : 'hidden';
    }
}
