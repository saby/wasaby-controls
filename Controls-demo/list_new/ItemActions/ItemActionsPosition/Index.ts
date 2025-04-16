import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsPosition/ItemActionsPosition';

import CustomPosition from 'Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/CustomPosition/Index';
import Hidden from 'Controls-demo/list_new/ItemActions/ItemActionsPosition/Custom/Hidden/Index';
import Inside from 'Controls-demo/list_new/ItemActions/ItemActionsPosition/Inside/Index';
import Outside from 'Controls-demo/list_new/ItemActions/ItemActionsPosition/Outside/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...CustomPosition.getLoadConfig(),
            ...Hidden.getLoadConfig(),
            ...Inside.getLoadConfig(),
            ...Outside.getLoadConfig(),
        };
    }
}
