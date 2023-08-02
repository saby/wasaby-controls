import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { CrudEntityKey, Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/list_new/ColumnsView/CustomTemplate/CustomTemplate');

const NUMBER_OF_ITEMS = 50;

function getData() {
    return generateData<{
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
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _itemActions: [object];

    protected _items: RecordSet;

    protected _selectedKeys: CrudEntityKey[];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'visible',
                    multiSelectVisibility: 'visible',
                    navigation: {
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
                    },
                },
            },
        };
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
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _onSelectedKeysChanged(event: SyntheticEvent, keys: CrudEntityKey[]): void {
        this._selectedKeys = keys;
    }

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
}
