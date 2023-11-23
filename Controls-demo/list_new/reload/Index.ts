import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/reload/Template';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IItem {
    title: string;
    key: number | string;
}

function getData(): IItem[] {
    return generateData({
        count: 300,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с идентификатором ${item.key}`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _position: number = 0;
    protected _paramsForReload: object = null;
    protected _reloadsCount: number = 0;
    protected _dataLoadCallback: Function;

    protected _beforeMount(): void {
        this._dataLoadCallback = (list) => {
            list.each((item) => {
                item.set(
                    'title',
                    `Запись с идентификатором ${item.get('key')}.  Количество перезагрузок: ${
                        this._reloadsCount
                    }`
                );
            });
        };
    }

    protected _reload() {
        this._reloadsCount++;
        this._children.list.reload(true);
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            reload: {
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
                    },
                },
            },
        };
    }
}
