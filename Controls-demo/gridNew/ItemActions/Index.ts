import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/ItemActions/ItemActions';

import ItemActionsNoHighlight from 'Controls-demo/gridNew/ItemActions/ItemActionsNoHighlight/Index';
import All from 'Controls-demo/gridNew/ItemActions/All/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemActionsNoHighlight.getLoadConfig(),
            ...All.getLoadConfig(),
        };
    }
}
