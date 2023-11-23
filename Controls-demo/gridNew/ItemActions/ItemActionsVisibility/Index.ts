import { Control, TemplateFunction } from 'UI/Base';

import * as Template from 'wml!Controls-demo/gridNew/ItemActions/ItemActionsVisibility/ItemActionsVisibility';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemActionsVisibilityDelayed from 'Controls-demo/gridNew/ItemActions/ItemActionsVisibility/Delayed/Index';
import ItemActionsVisibilityVisible from 'Controls-demo/gridNew/ItemActions/ItemActionsVisibility/Visible/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemActionsVisibilityDelayed.getLoadConfig(),
            ...ItemActionsVisibilityVisible.getLoadConfig(),
        };
    }
}
