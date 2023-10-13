import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithItemActions/WithItemActions';

import Inside from 'Controls-demo/gridNew/ColumnScroll/WithItemActions/Inside/Index';
import Outside from 'Controls-demo/gridNew/ColumnScroll/WithItemActions/Outside/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Inside.getLoadConfig(),
            ...Outside.getLoadConfig(),
        };
    }
}
