import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/SeparatorVisibility/SeparatorVisibility';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import WithoutSeparator from 'Controls-demo/gridNew/Grouped/SeparatorVisibility/WithoutSeparator/Index';
import WithSeparator from 'Controls-demo/gridNew/Grouped/SeparatorVisibility/WithSeparator/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithoutSeparator.getLoadConfig(),
            ...WithSeparator.getLoadConfig(),
        };
    }
}
