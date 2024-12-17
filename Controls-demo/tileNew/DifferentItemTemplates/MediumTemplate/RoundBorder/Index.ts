import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/RoundBorder';

import Border2xs from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/2xs/Index';
import Border3xs from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/3xs/Index';
import Borderm from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/m/Index';
import Bordernull from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/null/Index';
import Borders from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/s/Index';
import Borderxs from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/RoundBorder/xs/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;


    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Border2xs.getLoadConfig(),
            ...Border3xs.getLoadConfig(),
            ...Borderm.getLoadConfig(),
            ...Bordernull.getLoadConfig(),
            ...Borders.getLoadConfig(),
            ...Borderxs.getLoadConfig(),
        }
    }
}
