import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/EmptyGrid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EmptyGridAlign from 'Controls-demo/gridNew/EmptyGrid/Align/Index';
import EmptyGridColspanEmptyColumns from 'Controls-demo/gridNew/EmptyGrid/ColspanEmptyColumns/Index';
import EmptyGridEditing from 'Controls-demo/gridNew/EmptyGrid/Editing/Index';
import EmptyGridEditingEmptyTemplate from 'Controls-demo/gridNew/EmptyGrid/EditingEmptyTemplate/Index';
import WithHeader from 'Controls-demo/gridNew/EmptyGrid/WithHeader/Index';
import WithoutHeader from 'Controls-demo/gridNew/EmptyGrid/WithoutHeader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EmptyGridAlign.getLoadConfig(),
            ...EmptyGridColspanEmptyColumns.getLoadConfig(),
            ...EmptyGridEditing.getLoadConfig(),
            ...EmptyGridEditingEmptyTemplate.getLoadConfig(),
            ...WithHeader.getLoadConfig(),
            ...WithoutHeader.getLoadConfig(),
        };
    }
}
