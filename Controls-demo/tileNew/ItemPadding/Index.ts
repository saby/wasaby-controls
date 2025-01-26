import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tileNew/ItemPadding/ItemPadding';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import PaddingDefault from 'Controls-demo/tileNew/ItemPadding/PaddingDefault/Index';
import PaddingNull from 'Controls-demo/tileNew/ItemPadding/PaddingNull/Index';
import Padding3XS from 'Controls-demo/tileNew/ItemPadding/Padding3XS/Index';
import Padding2XS from 'Controls-demo/tileNew/ItemPadding/Padding2XS/Index';
import PaddingXS from 'Controls-demo/tileNew/ItemPadding/PaddingXS/Index';
import PaddingS from 'Controls-demo/tileNew/ItemPadding/PaddingS/Index';
import PaddingM from 'Controls-demo/tileNew/ItemPadding/PaddingM/Index';
import PaddingL from 'Controls-demo/tileNew/ItemPadding/PaddingL/Index';
import PaddingXL from 'Controls-demo/tileNew/ItemPadding/PaddingXL/Index';
import Padding2XL from 'Controls-demo/tileNew/ItemPadding/Padding2XL/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...PaddingDefault.getLoadConfig(),
            ...PaddingNull.getLoadConfig(),
            ...Padding3XS.getLoadConfig(),
            ...Padding2XS.getLoadConfig(),
            ...PaddingXS.getLoadConfig(),
            ...PaddingS.getLoadConfig(),
            ...PaddingM.getLoadConfig(),
            ...PaddingL.getLoadConfig(),
            ...PaddingXL.getLoadConfig(),
            ...Padding2XL.getLoadConfig(),
        };
    }
}
