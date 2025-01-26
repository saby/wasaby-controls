import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/Direction/Direction';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NavigationDirectionDown from 'Controls-demo/list_new/Navigation/Direction/Down/Index';
import NavigationDirectionBoth from 'Controls-demo/list_new/Navigation/Direction/Both/Index';
import NavigationDirectionUp from 'Controls-demo/list_new/Navigation/Direction/Up/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NavigationDirectionDown.getLoadConfig(),
            ...NavigationDirectionBoth.getLoadConfig(),
            ...NavigationDirectionUp.getLoadConfig(),
        };
    }
}
