import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/HasMore/HasMore';
import { Memory } from 'Types/source';
import {
    generateData,
    slowDownSource,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: [] = [{ displayProperty: 'title' }];
    private _dataArray: unknown = generateData({
        count: 200,
        entityTemplate: { title: 'lorem' },
    });
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig>;
    protected _gridVisible: boolean = true;

    protected _beforeMount(): void {
        this.initSource();

        this._navigation = {
            source: 'page',
            view: 'infinity',
            sourceConfig: {
                pageSize: 20,
                page: 5,
                hasMore: false,
            },
        };
    }

    protected initSource(newItems: boolean = false): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: newItems
                ? generateData({
                      count: 200,
                      entityTemplate: { title: 'lorem' },
                      beforeCreateItemCallback: (item) => {
                          item.new = true;
                      },
                  })
                : this._dataArray,
        });
        slowDownSource(this._viewSource, 2000);
    }

    protected _onReload(): void {
        this.initSource(true);
    }

    protected _onReloadWithNewNavigation(): void {
        const newNavigation: INavigationOptionValue<INavigationPageSourceConfig> =
            { ...this._navigation };
        newNavigation.sourceConfig.pageSize = 10;
        this._navigation = newNavigation;
        this._children.list.reload(false, this._navigation.sourceConfig);
    }

    protected _onToggleGridVisibility(): void {
        this._gridVisible = !this._gridVisible;
    }
}
