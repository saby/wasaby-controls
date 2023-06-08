import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeTypeProperty/NodeTypeProperty';

import Base from 'Controls-demo/treeGridNew/NodeTypeProperty/Base/Index';
import AlignedByColumn from 'Controls-demo/treeGridNew/NodeTypeProperty/AlignedByColumn/Index';
import ChildNodes from 'Controls-demo/treeGridNew/NodeTypeProperty/ChildNodes/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Base.getLoadConfig(),
            ...AlignedByColumn.getLoadConfig(),
            // ...ChildNodes.getLoadConfig(),
        };
    }
}
