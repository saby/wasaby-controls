import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/VirtualScroll';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ConstantHeights from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/Index';
import DifferentHeights from 'Controls-demo/list_new/VirtualScroll/DifferentHeights/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ConstantHeights.getLoadConfig(),
            ...DifferentHeights.getLoadConfig(),
        };
    }
}
