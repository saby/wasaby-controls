import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/RowSeparator/RowSeparator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import RowSeparatorBase from 'Controls-demo/gridNew/RowSeparator/Base/Index';
import RowSeparatorWide from 'Controls-demo/gridNew/RowSeparator/Wide/Index';
import RowSeparatorBaseNewDesign from 'Controls-demo/gridNew/RowSeparator/BaseNewDesign/Index';
import RowSeparatorWithHeaderAndGroups from 'Controls-demo/gridNew/RowSeparator/WithHeaderAndGroups/Index';
import RowSeparatorWithHeaderAndResults from 'Controls-demo/gridNew/RowSeparator/WithHeaderAndResults/Index';
import RowSeparatorWithMultiHeaderAndFooter from 'Controls-demo/gridNew/RowSeparator/WithMultiHeaderAndFooter/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RowSeparatorBase.getLoadConfig(),
            ...RowSeparatorWide.getLoadConfig(),
            ...RowSeparatorBaseNewDesign.getLoadConfig(),
            ...RowSeparatorWithHeaderAndGroups.getLoadConfig(),
            ...RowSeparatorWithHeaderAndResults.getLoadConfig(),
            ...RowSeparatorWithMultiHeaderAndFooter.getLoadConfig(),
        };
    }
}
