import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/VirtualScroll/VirtualScroll';

import Default from 'Controls-demo/gridNew/VirtualScroll/Default/Index';
import Sticky from 'Controls-demo/gridNew/VirtualScroll/Sticky/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...Sticky.getLoadConfig(),
        };
    }
}
