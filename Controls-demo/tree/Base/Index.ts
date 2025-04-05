import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/Base/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import BaseView from 'Controls-demo/tree/Base/View/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...BaseView.getLoadConfig(),
        };
    }
}
