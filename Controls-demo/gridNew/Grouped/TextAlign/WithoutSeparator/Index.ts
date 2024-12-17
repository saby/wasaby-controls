import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/TextAlign/WithoutSeparator/WithoutSeparator';

import Left from 'Controls-demo/gridNew/Grouped/TextAlign/WithoutSeparator/Left/Index';
import Right from 'Controls-demo/gridNew/Grouped/TextAlign/WithoutSeparator/Right/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Left.getLoadConfig(),
            ...Right.getLoadConfig(),
        };
    }
}
