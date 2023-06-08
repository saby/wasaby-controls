import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { IItemAction } from 'Controls/itemActions';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/list_new/ColumnsView/TemplateProperty/TemplateProperty';
import * as ItemTemplate from 'wml!Controls-demo/list_new/ColumnsView/TemplateProperty/ItemTemplate';

const NUMBER_OF_ITEMS = 50;

interface IData {
    key: number;
    title: string;
    description: string;
    column: number;
    itemTemplate: TemplateFunction;
}

const data: IData[] = generateData<IData>({
    count: NUMBER_OF_ITEMS,
    entityTemplate: { title: 'string', description: 'lorem' },
    beforeCreateItemCallback: (item) => {
        item.title = `Запись с id="${item.key}". ${item.title}`;
        // eslint-disable-next-line
        item.column = item.key < 10 ? 0 : item.key > 23 ? 1 : 2;
        item.itemTemplate = ItemTemplate;
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

/**
 * Демка Используется в автодоке.
 * Демка Используется для теста по https://online.sbis.ru/opendoc.html?guid=32bb4c04-e874-4a2a-84b6-2dd14d5ac53d.
 */
export default class TemplateProperty extends Control {
    protected _template: TemplateFunction = Template;

    protected _viewSource: Memory;

    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;

    protected _itemActions: IItemAction[] = itemActions;

    protected _items: RecordSet;

    protected _beforeMount(): void {
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
