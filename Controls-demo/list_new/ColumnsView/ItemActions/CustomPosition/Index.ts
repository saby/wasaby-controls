import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import 'css!Controls-demo/list_new/ColumnsView/ItemActions/CustomPosition/CustomPosition';
import template = require('wml!Controls-demo/list_new/ColumnsView/ItemActions/CustomPosition/CustomPosition');

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

const itemActions: IItemAction[] = [
    {
        id: 1,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete',
        showType: 2,
    },
];

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _itemActions: IItemAction[];

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
        this._itemActions = itemActions;
        this._selectedKeys = [];
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    private _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }
}
