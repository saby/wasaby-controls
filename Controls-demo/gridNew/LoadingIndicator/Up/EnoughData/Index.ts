import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/EnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorUpEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/HasMore/Index';
import LoadingIndicatorUpEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorUpEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
