import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MoreButton/MoreButton';

import Base from 'Controls-demo/list_new/Navigation/MoreButton/Base/Index';
import ButtonConfig from 'Controls-demo/list_new/Navigation/MoreButton/ButtonConfig/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...ButtonConfig.getLoadConfig(),
        };
    }
}
