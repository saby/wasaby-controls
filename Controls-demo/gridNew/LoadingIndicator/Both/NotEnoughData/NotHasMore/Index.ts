import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotHasMore/NotHasMore';
import { Memory } from 'Types/source';
import {
    generateData,
    slowDownSource,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';
import { IColumn } from 'Controls/grid';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig> =
        {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                pageSize: 20,
                page: 0,
                hasMore: false,
            },
        };

    protected _beforeMount(): void {
        this._createSource(10);
    }

    private _createSource(count: number): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: generateData({ count, entityTemplate: { title: 'lorem' } }),
        });
        slowDownSource(this._viewSource, 2000);
    }

    protected _onReload(): void {
        this._children.list.reload();
    }

    protected _onReloadWithMoreData(): void {
        this._createSource(100);
        this._navigation.sourceConfig.page = 2;
    }
}
