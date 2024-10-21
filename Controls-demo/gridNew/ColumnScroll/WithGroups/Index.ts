import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithGroups/WithGroups';

import WithoutSeparator from 'Controls-demo/gridNew/ColumnScroll/WithGroups/WithoutSeparator/Index';
import WithSeparator from 'Controls-demo/gridNew/ColumnScroll/WithGroups/WithSeparator/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithoutSeparator.getLoadConfig(),
            ...WithSeparator.getLoadConfig(),
        };
    }
}
