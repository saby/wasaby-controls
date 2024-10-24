import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Base/Base';

import TreeView from 'Controls-demo/treeGridNew/Base/TreeView/Index';
import TreeGridView from 'Controls-demo/treeGridNew/Base/TreeGridView/Index';
import BaseTreeGridViewLongTitle from 'Controls-demo/treeGridNew/Base/TreeGridViewLongTitle/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...TreeView.getLoadConfig(),
            ...TreeGridView.getLoadConfig(),
            ...BaseTreeGridViewLongTitle.getLoadConfig(),
        };
    }
}
