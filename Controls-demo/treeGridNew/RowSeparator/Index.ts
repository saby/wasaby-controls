import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/RowSeparator/RowSeparator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import RowSeparatorBase from 'Controls-demo/treeGridNew/RowSeparator/Base/Index';
import RowSeparatorBaseNewDesign from 'Controls-demo/treeGridNew/RowSeparator/BaseNewDesign/Index';
import RowSeparatorWithHeaderAndGroups from 'Controls-demo/treeGridNew/RowSeparator/WithHeaderAndGroups/Index';
import RowSeparatorWide from 'Controls-demo/treeGridNew/RowSeparator/Wide/Index';
import RowSeparatorWithHeaderAndResults from 'Controls-demo/treeGridNew/RowSeparator/WithHeaderAndResults/Index';
import RowSeparatorWithMultiHeaderAndFooter from 'Controls-demo/treeGridNew/RowSeparator/WithMultiHeaderAndFooter/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RowSeparatorBase.getLoadConfig(),
            ...RowSeparatorBaseNewDesign.getLoadConfig(),
            ...RowSeparatorWithHeaderAndGroups.getLoadConfig(),
            ...RowSeparatorWide.getLoadConfig(),
            ...RowSeparatorWithHeaderAndResults.getLoadConfig(),
            ...RowSeparatorWithMultiHeaderAndFooter.getLoadConfig(),
        };
    }
}
