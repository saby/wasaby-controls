import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/VirtualScroll/VirtualScrollContainer/Both/Template';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

interface IItem {
    key: number;
    title: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        count: 200,
        entityTemplate: { title: 'number' },
        beforeCreateItemCallback(item: IItem): void {
            item.title = `Запись #${item.key}`;
        },
    });
}

export default class extends Control {
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
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            page: 0,
                            pageSize: 20,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'edge',
                        },
                    },
                },
            },
        };
    }
}
