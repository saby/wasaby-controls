import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/RightTemplate/RightTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import WithoutSeparator from 'Controls-demo/gridNew/Grouped/RightTemplate/WithoutSeparator/Index';
import WithSeparator from 'Controls-demo/gridNew/Grouped/RightTemplate/WithSeparator/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithoutSeparator.getLoadConfig(),
            ...WithSeparator.getLoadConfig(),
        };
    }
}
