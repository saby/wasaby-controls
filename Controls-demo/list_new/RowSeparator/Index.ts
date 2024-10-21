import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/RowSeparator/RowSeparator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import RowSeparatorBase from 'Controls-demo/list_new/RowSeparator/Base/Index';
import RowSeparatorWithFooter from 'Controls-demo/list_new/RowSeparator/WithFooter/Index';
import RowSeparatorWide from 'Controls-demo/list_new/RowSeparator/Wide/Index';
import RowSeparatorWithGroups from 'Controls-demo/list_new/RowSeparator/WithGroups/Index';
import RowSeparatorRowSeparatorVisibility from 'Controls-demo/list_new/RowSeparator/RowSeparatorVisibility/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...RowSeparatorBase.getLoadConfig(),
            ...RowSeparatorWithFooter.getLoadConfig(),
            ...RowSeparatorWide.getLoadConfig(),
            ...RowSeparatorWithGroups.getLoadConfig(),
            ...RowSeparatorRowSeparatorVisibility.getLoadConfig(),
        };
    }
}
