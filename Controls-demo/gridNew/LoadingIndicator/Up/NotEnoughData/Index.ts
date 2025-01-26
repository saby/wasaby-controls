import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/NotEnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorUpNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/HasMore/Index';
import LoadingIndicatorUpNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorUpNotEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpNotEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
