import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ItemActions/ItemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemActionsCustomPosition from 'Controls-demo/treeGridNew/ItemActions/CustomPosition/Index';
import ItemActionsHorizontalScroll from 'Controls-demo/treeGridNew/ItemActions/HorizontalScroll/Index';
import ItemActionsNoHighlight from 'Controls-demo/treeGridNew/ItemActions/ItemActionsNoHighlight/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemActionsCustomPosition.getLoadConfig(),
            ...ItemActionsHorizontalScroll.getLoadConfig(),
            ...ItemActionsNoHighlight.getLoadConfig(),
        };
    }
}
