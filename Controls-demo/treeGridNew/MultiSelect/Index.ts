import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/MultiSelect';

import MultiSelectVisibility from 'Controls-demo/treeGridNew/MultiSelect/MultiSelectVisibility/Index';
import SelectAncestors from 'Controls-demo/treeGridNew/MultiSelect/SelectAncestors/Index';
import SelectDescendants from 'Controls-demo/treeGridNew/MultiSelect/SelectDescendants/Index';
import CustomPosition from 'Controls-demo/treeGridNew/MultiSelect/CustomPosition/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MultiSelectVisibility.getLoadConfig(),
            ...SelectAncestors.getLoadConfig(),
            ...SelectDescendants.getLoadConfig(),
            ...CustomPosition.getLoadConfig(),
        };
    }
}
