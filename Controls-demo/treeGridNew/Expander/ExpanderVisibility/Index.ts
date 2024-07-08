import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderVisibility/ExpanderVisibility';

import HasChildren from 'Controls-demo/treeGridNew/Expander/ExpanderVisibility/HasChildren/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...HasChildren.getLoadConfig(),
        };
    }
}
