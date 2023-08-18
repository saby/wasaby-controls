import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as controlTemplate from 'wml!Controls-demo/list_new/Navigation/Cut/ContrastBackground/ContrastBackground';

import Default from 'Controls-demo/list_new/Navigation/Cut/ContrastBackground/Default/Index';
import False from 'Controls-demo/list_new/Navigation/Cut/ContrastBackground/False/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...False.getLoadConfig(),
        };
    }
}
