import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ReverseType/ReverseType';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ReverseTypeExpandedByItemClick from 'Controls-demo/treeGridNew/ReverseType/ExpandedByItemClick/Index';
import ReverseTypeSingleExpand from 'Controls-demo/treeGridNew/ReverseType/SingleExpand/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ReverseTypeExpandedByItemClick.getLoadConfig(),
            ...ReverseTypeSingleExpand.getLoadConfig(),
        };
    }
}
