import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/ConstantHeights/BigLastItem/BigLastItem';
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
    const dataArray = generateData({
        keyProperty: 'key',
        count: 200,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
    let title = dataArray[dataArray.length - 1].title;
    for (let i = 0; i < 7; i++) {
        title += title;
    }
    dataArray[dataArray.length - 1].title = title;
    return dataArray;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _initialScrollPosition: object = {
        vertical: 'end',
    };

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
                            pageSize: 20,
                            page: 10,
                            hasMore: false,
                            direction: 'backward',
                        },
                        viewConfig: {
                            showEndButton: true,
                            pagingMode: 'direct',
                        },
                    },
                },
            },
        };
    }
}
