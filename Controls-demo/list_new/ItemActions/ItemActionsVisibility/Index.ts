import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsVisibility/ItemActions';

import Delayed from 'Controls-demo/list_new/ItemActions/ItemActionsVisibility/Delayed/Index';
import Onhover from 'Controls-demo/list_new/ItemActions/ItemActionsVisibility/Onhover/Index';
import Visible from 'Controls-demo/list_new/ItemActions/ItemActionsVisibility/Visible/Index';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Delayed.getLoadConfig(),
            ...Onhover.getLoadConfig(),
            ...Visible.getLoadConfig(),
        };
    }
}
