import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/ItemsContainerPadding/ItemsContainerPadding';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Padding2XL from 'Controls-demo/tileNew/ItemsContainerPadding/Padding2XL/Index';
import Padding3XL from 'Controls-demo/tileNew/ItemsContainerPadding/Padding3XL/Index';
import PaddingDefault from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingDefault/Index';
import PaddingL from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingL/Index';
import PaddingM from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingM/Index';
import PaddingNull from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingNull/Index';
import PaddingS from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingS/Index';
import PaddingXL from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingXL/Index';
import PaddingXS from 'Controls-demo/tileNew/ItemsContainerPadding/PaddingXS/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Padding2XL.getLoadConfig(),
            ...Padding3XL.getLoadConfig(),
            ...PaddingDefault.getLoadConfig(),
            ...PaddingL.getLoadConfig(),
            ...PaddingM.getLoadConfig(),
            ...PaddingNull.getLoadConfig(),
            ...PaddingS.getLoadConfig(),
            ...PaddingXL.getLoadConfig(),
            ...PaddingXS.getLoadConfig(),
        };
    }
}
