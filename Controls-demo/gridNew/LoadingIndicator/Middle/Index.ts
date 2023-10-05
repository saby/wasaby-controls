import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Middle/Middle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorMiddleColumnScroll from 'Controls-demo/gridNew/LoadingIndicator/Middle/ColumnScroll/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorMiddleColumnScroll.getLoadConfig(),
        };
    }
}
