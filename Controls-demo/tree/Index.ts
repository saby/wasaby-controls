import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/tree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Base from 'Controls-demo/tree/Base/Index';
import HorizontalLeaves from 'Controls-demo/tree/HorizontalLeaves/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
        };
    }
}
