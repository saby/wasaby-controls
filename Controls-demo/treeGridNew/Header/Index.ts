import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Header/Header';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Default from 'Controls-demo/treeGridNew/Header/Default/Index';
import LongHeader from 'Controls-demo/treeGridNew/Header/LongHeader/Index';
import MultiHeader from 'Controls-demo/treeGridNew/Header/MultiHeader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...LongHeader.getLoadConfig(),
            ...MultiHeader.getLoadConfig(),
        };
    }
}
