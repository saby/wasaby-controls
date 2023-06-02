import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MoreButton/Base/Base';
import { generateData } from '../../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _dataArray: unknown = generateData({
        count: 30,
        entityTemplate: { title: 'lorem' },
    });
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig>;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
        this._navigation = {
            source: 'page',
            view: 'demand',
            sourceConfig: {
                pageSize: 7,
                hasMore: false,
                page: 0,
            },
            viewConfig: {
                pagingMode: 'basic',
                buttonView: 'separator',
            },
        };
    }
}
