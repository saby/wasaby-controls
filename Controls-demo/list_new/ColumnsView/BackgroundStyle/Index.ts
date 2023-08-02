import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../DemoHelpers/DataCatalog';
import template = require('wml!Controls-demo/list_new/ColumnsView/BackgroundStyle/Template');

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
        },
    });
}

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

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
                },
            },
        };
    }
}
