import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/EnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorBothEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/HasMore/Index';
import LoadingIndicatorBothEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorBothEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorBothEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
