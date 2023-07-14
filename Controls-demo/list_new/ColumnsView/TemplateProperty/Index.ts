import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

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

function getData(): IData[] {
    return generateData<IData>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string', description: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
            // eslint-disable-next-line
            item.column = item.key < 10 ? 0 : item.key > 23 ? 1 : 2;
            item.itemTemplate = ItemTemplate;
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

/**
 * Демка Используется в автодоке.
 * Демка Используется для теста по https://online.sbis.ru/opendoc.html?guid=32bb4c04-e874-4a2a-84b6-2dd14d5ac53d.
 */
export default class TemplateProperty extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = itemActions;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewTemplateProperty: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
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
                    markerVisibility: 'visible',
                },
            },
        };
    }
}
