import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/MarkerVisibility/MarkerVisibility';

import NotMarkIByExpanderClick from 'Controls-demo/treeGridNew/MarkerVisibility/NotMarkIByExpanderClick/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NotMarkIByExpanderClick.getLoadConfig(),
        };
    }
}
