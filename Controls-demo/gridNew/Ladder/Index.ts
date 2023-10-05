import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Ladder/Ladder';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import NoSticky from 'Controls-demo/gridNew/Ladder/NoSticky/Index';
import Sticky from 'Controls-demo/gridNew/Ladder/Sticky/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...NoSticky.getLoadConfig(),
            ...Sticky.getLoadConfig(),
        };
    }
}
