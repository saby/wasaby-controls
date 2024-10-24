import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/SelectAncestors/SelectAncestors';

import AutoSelectAncestors from 'Controls-demo/treeGridNew/MultiSelect/SelectAncestors/AutoSelectAncestors/Index';
import DoNotSelectAncestors from 'Controls-demo/treeGridNew/MultiSelect/SelectAncestors/DoNotSelectAncestors/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...AutoSelectAncestors.getLoadConfig(),
            ...DoNotSelectAncestors.getLoadConfig(),
        };
    }
}
