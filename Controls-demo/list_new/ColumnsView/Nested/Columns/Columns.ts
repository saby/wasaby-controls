import { Control, TemplateFunction } from 'UI/Base';
import { Memory, CrudEntityKey } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { IItemAction } from 'Controls/itemActions';

import 'css!Controls-demo/list_new/ColumnsView/Nested/Columns/Columns';
import template = require('wml!Controls-demo/list_new/ColumnsView/Nested/Columns/Columns');

const NUMBER_OF_ITEMS = 2;

const data = generateData<{
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

    protected _viewSource: Memory;

    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;

    protected _itemActions: IItemAction[];

    protected _selectedKeys: CrudEntityKey[];

    protected _beforeMount(): void {
        this._itemActions = itemActions;
        this._selectedKeys = [];
        this._viewSource = new Memory({
            data,
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
