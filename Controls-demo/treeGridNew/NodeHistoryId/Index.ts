import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeHistoryId/NodeHistoryId';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NodeHistoryIdBase from 'Controls-demo/treeGridNew/NodeHistoryId/Base/Index';
import NodeHistoryIdWithExpandedItems from 'Controls-demo/treeGridNew/NodeHistoryId/WithExpandedItems/Index';
import NodeHistoryIdNodeHistoryType from 'Controls-demo/treeGridNew/NodeHistoryId/NodeHistoryType/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NodeHistoryIdBase.getLoadConfig(),
            ...NodeHistoryIdWithExpandedItems.getLoadConfig(),
            // ...NodeHistoryIdNodeHistoryType.getLoadConfig(),
        };
    }
}
