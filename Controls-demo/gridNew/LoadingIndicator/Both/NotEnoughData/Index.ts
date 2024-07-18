import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotEnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorBothNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotHasMore/Index';
import LoadingIndicatorBothNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/HasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorBothNotEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorBothNotEnoughDataHasMore.getLoadConfig(),
        };
    }
}
