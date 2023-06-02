import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/CustomTemplate/CustomTemplate');
import { Memory as MemorySource, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';

const NUMBER_OF_ITEMS = 50;

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;

    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;

    protected _itemActions: [object];

    protected _items: RecordSet;

    protected _selectedKeys: [];

    private _dataArray: { key: number; title: string; description: string }[];
    // eslint-disable-next-line
    private deleteHandler(item: any): void {
        const key = item.getId();
        const index = this._items.getIndex(item);
        this._items.removeAt(index);
    }
    private _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }
    private removeItems(): void {
        const items = this._selectedKeys;
        let item;
        for (let i = 0; i < items.length; i++) {
            item = this._items.getRecordById(items[i]);
            if (item) {
                this._items.remove(item);
            }
        }
        this._selectedKeys = [];
    }
    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'delete',
                showType: 2,
                handler: this.deleteHandler.bind(this),
            },
        ];
        this._selectedKeys = [];
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._dataArray = generateData<{
            key: number;
            title: string;
            description: string;
            column: number;
        }>({
            count: NUMBER_OF_ITEMS,
            entityTemplate: { title: 'string', description: 'lorem' },
            beforeCreateItemCallback: (item) => {
                item.title = `Запись с id="${item.key}". ${item.title}`;
                // eslint-disable-next-line
                item.column = item.key < 10 ? 0 : item.key > 23 ? 1 : 2;
            },
        });
        this._viewSource = new MemorySource({
            data: this._dataArray,
            keyProperty: 'key',
        });
        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                page: 0,
                pageSize: 50,
                hasMore: false,
            },
            viewConfig: {
                pagingMode: 'basic',
            },
        };
    }
}
