import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IVirtualScrollConfig } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import template = require('wml!Controls-demo/list_new/ColumnsView/VirtualScrollWithGroups/VirtualScrollWithGroups');

const NUMBER_OF_ITEMS = 200;
const COUNT_ITEMS_IN_GROUP = 50;

function getData() {
    const data = generateData<{
        key: number;
        title: string;
        description: string;
        group: string;
    }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string', description: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
        },
    });
    let groupId = 0;
    data.forEach((item, index) => {
        item.group = `Группа ${groupId}`;
        if (index !== 0 && index % COUNT_ITEMS_IN_GROUP === 0) {
            groupId++;
        }
    });
    return data;
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    protected _virtualScrollConfig: IVirtualScrollConfig = {
        pageSize: 30,
    };

    protected _items: RecordSet;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewVirtualScrollWithGroups: {
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
                            pageSize: 30,
                            hasMore: false,
                        },
                    },
                },
            },
        };
    }
}
