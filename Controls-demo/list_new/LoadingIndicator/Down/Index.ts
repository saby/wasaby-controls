import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/Down/Down';
import { Memory } from 'Types/source';
import { generateData, slowDownSource } from '../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const TIMEOUT3500 = 3500;

interface IItem {
    title: string;
    key: string | number;
}

function getData(): IItem[] {
    return generateData<{
        key: number;
        title: string;
    }>({
        count: 100,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись списка с id = ${item.key}.`;
        },
    });
}

function getSource(): Memory {
    const source = new Memory({
        keyProperty: 'key',
        data: getData(),
    });
    slowDownSource(source, TIMEOUT3500);
    return source;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LoadingIndicatorDown: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: getSource(),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            direction: 'forward',
                            pageSize: 20,
                            page: 0,
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
}
