import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/PartialColumnSeparator';

import VariantOne from 'Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/VariantOne/Index';
import VariantTwo from 'Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/VariantTwo/Index';
import VariantThree from 'Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/VariantThree/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...VariantOne.getLoadConfig(),
            ...VariantTwo.getLoadConfig(),
            ...VariantThree.getLoadConfig(),
        };
    }
}
