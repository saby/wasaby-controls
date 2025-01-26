import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Up/Up';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorUpEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/HasMore/Index';
import LoadingIndicatorUpEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/NotHasMore/Index';
import LoadingIndicatorUpNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/HasMore/Index';
import LoadingIndicatorUpNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/NotHasMore/Index';
import LoadingIndicatorUpVirtualPageSize from 'Controls-demo/gridNew/LoadingIndicator/Up/VirtualPageSize/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorUpEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorUpNotEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpNotEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorUpVirtualPageSize.getLoadConfig(),
        };
    }
}
