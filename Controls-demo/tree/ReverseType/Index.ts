import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/ReverseType/ReverseType';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ExpandedByItemClick from 'Controls-demo/tree/ReverseType/ExpandedByItemClick/Index';
import SingleExpand from 'Controls-demo/tree/ReverseType/SingleExpand/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ExpandedByItemClick.getLoadConfig(),
            ...SingleExpand.getLoadConfig(),
        };
    }
}
