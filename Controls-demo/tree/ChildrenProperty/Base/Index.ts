import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/ChildrenProperty/Base/View';
import { HierarchicalMemory } from 'Types/source';
import { materializedPathData } from 'Controls-demo/tree/data/Devices';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _navigation: INavigationOptionValue<INavigationPageSourceConfig>;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: materializedPathData,
        });
        this._navigation = {
            source: 'page',
            sourceConfig: {
                page: 0,
                pageSize: 3,
                hasMore: false,
            },
            view: 'demand',
        };
    }
}
