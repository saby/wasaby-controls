import { Control, TemplateFunction } from 'UI/Base';
// eslint-disable-next-line
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/UpdateByScrolling/UpdateByScrolling';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../../DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

function getData(): IItem[] {
    return generateData({
        keyProperty: 'key',
        count: 1000,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
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
                            pageSize: 25,
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
