import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/listTemplates/ListItemTemplate/ListItemTemplate';

import RoundBorders from 'Controls-demo/listTemplates/ListItemTemplate/RoundBorders/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RoundBorders.getLoadConfig(),
        };
    }
}
