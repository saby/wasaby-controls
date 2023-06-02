import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MaxCountAutoLoad/MaxCountAutoLoad';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _navigation: INavigationOptionValue<INavigationSourceConfig>;
    private _dataArray: unknown = generateData({
        count: 20,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = item.key + 1 + ') Запись с id = ' + item.key;
        },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
        this._navigation = {
            source: 'page',
            view: 'maxCount',
            sourceConfig: {
                pageSize: 5,
                page: 0,
                hasMore: false,
            },
            viewConfig: {
                maxCountValue: 10,
            },
        };
    }
}
