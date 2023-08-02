import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/DifferentHeights/BigFirstItem/Down/Down';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../../DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: string | number;
}

function getData(): IItem[] {
    return generateData<{
        key: number;
        title: string;
    }>({
        count: 1000,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
            if (item.key === 0) {
                item.title = 'Это очень большая запись!';
            }
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

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
                            pageSize: 100,
                            page: 0,
                            hasMore: false,
                        },
                        viewConfig: {
                            pagingMode: 'hidden',
                        },
                    },
                },
            },
        };
    }
}
