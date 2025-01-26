import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/KeyProperty/KeyProperty';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import KeyPropertyBase from 'Controls-demo/list_new/KeyProperty/Base/Index';
import KeyPropertyError from 'Controls-demo/list_new/KeyProperty/Error/Index';
import KeyPropertySource from 'Controls-demo/list_new/KeyProperty/Source/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...KeyPropertyBase.getLoadConfig(),
            ...KeyPropertyError.getLoadConfig(),
            ...KeyPropertySource.getLoadConfig(),
        };
    }
}
