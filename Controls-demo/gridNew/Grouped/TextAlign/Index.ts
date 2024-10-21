import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/TextAlign/TextAlign';

import WithoutSeparator from 'Controls-demo/gridNew/Grouped/TextAlign/WithoutSeparator/Index';
import WithSeparator from 'Controls-demo/gridNew/Grouped/TextAlign/WithSeparator/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithoutSeparator.getLoadConfig(),
            ...WithSeparator.getLoadConfig(),
        };
    }
}
