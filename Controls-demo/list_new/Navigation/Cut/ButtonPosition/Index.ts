import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as controlTemplate from 'wml!Controls-demo/list_new/Navigation/Cut/ButtonPosition/ButtonPosition';

import Center from 'Controls-demo/list_new/Navigation/Cut/ButtonPosition/Center/Index';
import Start from 'Controls-demo/list_new/Navigation/Cut/ButtonPosition/Start/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Center.getLoadConfig(),
            ...Start.getLoadConfig(),
        };
    }
}
