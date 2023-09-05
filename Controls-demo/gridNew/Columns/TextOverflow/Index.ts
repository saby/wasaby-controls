import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/TextOverflow/TextOverflow';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ColumnsTextOverflowEllipsis from 'Controls-demo/gridNew/Columns/TextOverflow/Ellipsis/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ColumnsTextOverflowEllipsis.getLoadConfig(),
        };
    }
}
