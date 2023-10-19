import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/ColumnSeparator/ColumnSeparator';

import FixedHeight from 'Controls-demo/gridNew/ColumnSeparator/FixedHeight/Index';
import WithMultiHeader from 'Controls-demo/gridNew/ColumnSeparator/WithMultiHeader/Index';
import PartialColumnSeparator from 'Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...FixedHeight.getLoadConfig(),
            ...WithMultiHeader.getLoadConfig(),
            ...PartialColumnSeparator.getLoadConfig(),
        };
    }
}
