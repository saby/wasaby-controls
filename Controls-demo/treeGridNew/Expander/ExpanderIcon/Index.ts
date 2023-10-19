import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/Expander/ExpanderIcon/ExpanderIcon';

import EmptyNode from 'Controls-demo/treeGridNew/Expander/ExpanderIcon/EmptyNode/Index';
import None from 'Controls-demo/treeGridNew/Expander/ExpanderIcon/None/Index';
import Node from 'Controls-demo/treeGridNew/Expander/ExpanderIcon/Node/Index';
import HiddenNode from 'Controls-demo/treeGridNew/Expander/ExpanderIcon/HiddenNode/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EmptyNode.getLoadConfig(),
            ...None.getLoadConfig(),
            ...Node.getLoadConfig(),
            ...HiddenNode.getLoadConfig(),
        };
    }
}
