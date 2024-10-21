import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EmptyList/EmptyList';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EmptyListDefault from 'Controls-demo/list_new/EmptyList/Default/Index';
import EmptyListEditing from 'Controls-demo/list_new/EmptyList/Editing/Index';
import EmptyListEmptyListWithFooter from 'Controls-demo/list_new/EmptyList/EmptyListWithFooter/Index';
import EmptyListSpacing from 'Controls-demo/list_new/EmptyList/Spacing/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EmptyListDefault.getLoadConfig(),
            ...EmptyListEditing.getLoadConfig(),
            ...EmptyListEmptyListWithFooter.getLoadConfig(),
            ...EmptyListSpacing.getLoadConfig(),
        };
    }
}
