import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/RoundBorder';

import RoundBorder2xs from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/2xs/Index';
import RoundBorder3xs from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/3xs/Index';
import RoundBorderm from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/m/Index';
import RoundBordernull from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/null/Index';
import RoundBorders from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/s/Index';
import RoundBorderxs from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/xs/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RoundBorder2xs.getLoadConfig(),
            ...RoundBorder3xs.getLoadConfig(),
            ...RoundBorderm.getLoadConfig(),
            ...RoundBordernull.getLoadConfig(),
            ...RoundBorders.getLoadConfig(),
            ...RoundBorderxs.getLoadConfig(),
        };
    }
}
