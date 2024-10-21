import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Multiselect/Multiselect';

import Base from 'Controls-demo/gridNew/Multiselect/Base/Index';
import CustomPosition from 'Controls-demo/gridNew/Multiselect/CustomPosition/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...CustomPosition.getLoadConfig(),
        };
    }
}
