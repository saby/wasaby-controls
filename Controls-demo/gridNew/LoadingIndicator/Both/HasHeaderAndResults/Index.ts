import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndResults/HasHeaderAndResults';
import { Memory } from 'Types/source';
import {
    generateData,
    slowDownSource,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: [] = [{ displayProperty: 'title' }];
    protected _header: [] = [{ caption: 'Заголовок' }];
    private _dataArray: unknown = generateData({
        count: 200,
        entityTemplate: { title: 'lorem' },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }

    protected _afterMount(): void {
        const loadingTimeout = new URLSearchParams(window.location.search).get(
            'loading-timeout'
        );
        slowDownSource(this._viewSource, Number(loadingTimeout) || 2000);
    }

    protected _onReload(): void {
        this._children.list.reload();
    }
}
