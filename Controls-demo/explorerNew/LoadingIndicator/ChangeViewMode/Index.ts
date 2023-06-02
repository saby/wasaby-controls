import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/LoadingIndicator/ChangeViewMode/ChangeViewMode';
import { TRoot } from 'Controls-demo/types';
import { Memory } from 'Types/source';
import {
    generateData,
    slowDownSource,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _viewMode: string = 'list';
    protected _root: TRoot = null;
    private _dataArray: unknown = generateData({
        count: 100,
        entityTemplate: { title: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с ключом ${item.key}.`;
            item.node = null;
            item.parent = null;
        },
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

    protected _changeViewMode(): void {
        this._viewMode = this._viewMode === 'list' ? 'tile' : 'list';
    }
}
