import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/SelectDescendants/SelectDescendants';

import AutoSelectDescendants from 'Controls-demo/treeGridNew/MultiSelect/SelectDescendants/AutoSelectDescendants/Index';
import DoNotSelectDescendants from 'Controls-demo/treeGridNew/MultiSelect/SelectDescendants/DoNotSelectDescendants/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...AutoSelectDescendants.getLoadConfig(),
            ...DoNotSelectDescendants.getLoadConfig(),
        };
    }
}
