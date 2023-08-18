import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/RoundBorder/RoundBorder';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import RoundBorder2XL from 'Controls-demo/tileNew/RoundBorder/2XL/Index';
import RoundBorder2XS from 'Controls-demo/tileNew/RoundBorder/2XS/Index';
import RoundBorder3XL from 'Controls-demo/tileNew/RoundBorder/3XL/Index';
import RoundBorder3XS from 'Controls-demo/tileNew/RoundBorder/3XS/Index';
import RoundBorderDefault from 'Controls-demo/tileNew/RoundBorder/Default/Index';
import RoundBorderL from 'Controls-demo/tileNew/RoundBorder/L/Index';
import RoundBorderM from 'Controls-demo/tileNew/RoundBorder/M/Index';
import RoundBorderS from 'Controls-demo/tileNew/RoundBorder/S/Index';
import RoundBorderXL from 'Controls-demo/tileNew/RoundBorder/XL/Index';
import RoundBorderXS from 'Controls-demo/tileNew/RoundBorder/XS/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RoundBorder2XL.getLoadConfig(),
            ...RoundBorder2XS.getLoadConfig(),
            ...RoundBorder3XL.getLoadConfig(),
            ...RoundBorder3XS.getLoadConfig(),
            ...RoundBorderDefault.getLoadConfig(),
            ...RoundBorderL.getLoadConfig(),
            ...RoundBorderM.getLoadConfig(),
            ...RoundBorderS.getLoadConfig(),
            ...RoundBorderXL.getLoadConfig(),
            ...RoundBorderXS.getLoadConfig(),
        };
    }
}
