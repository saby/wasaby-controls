import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/VirtualScroll';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import VirtualScrollHasMoreMany from 'Controls-demo/treeGridNew/VirtualScroll/HasMoreMany/Index';
import VirtualScrollDefault from 'Controls-demo/treeGridNew/VirtualScroll/Default/Index';
import VirtualScrollLastNodeExpanded from 'Controls-demo/treeGridNew/VirtualScroll/LastNodeExpanded/Index';
import VirtualScrollRenderRedrawCount from 'Controls-demo/treeGridNew/VirtualScroll/RenderRedrawCount/Index';
import VirtualScrollWithItemActions from 'Controls-demo/treeGridNew/VirtualScroll/WithItemActions/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...VirtualScrollHasMoreMany.getLoadConfig(),
            // ...VirtualScrollDefault.getLoadConfig(),
            ...VirtualScrollLastNodeExpanded.getLoadConfig(),
            ...VirtualScrollRenderRedrawCount.getLoadConfig(),
            ...VirtualScrollWithItemActions.getLoadConfig(),
        };
    }
}
