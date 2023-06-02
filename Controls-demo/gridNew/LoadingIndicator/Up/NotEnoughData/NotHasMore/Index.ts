import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/NotHasMore/NotHasMore';
import { Memory } from 'Types/source';
import {
    generateData,
    slowDownSource,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: [] = [{ displayProperty: 'title' }];
    private _dataArray: unknown = generateData({
        count: 10,
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
        slowDownSource(this._viewSource, 2000);
    }

    protected _onReload(): void {
        this._children.list.reload();
    }
}
