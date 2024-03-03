import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/EnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import IndicatorDownEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/HasMore/Index';
import IndicatorDownEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...IndicatorDownEnoughDataHasMore.getLoadConfig(),
            ...IndicatorDownEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
