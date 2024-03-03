import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/ScaleOnHover/ScaleOnHover';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Default from 'Controls-demo/tileNew/ScaleOnHover/Default/Index';
import WithActions from 'Controls-demo/tileNew/ScaleOnHover/WithActions/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...WithActions.getLoadConfig(),
        };
    }
}
