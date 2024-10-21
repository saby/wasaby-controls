import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/Down';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import IndicatorDownColumnScroll from 'Controls-demo/gridNew/LoadingIndicator/Down/ColumnScroll/Index';
import IndicatorDownEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/HasMore/Index';
import IndicatorDownNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/HasMore/Index';
import IndicatorDownEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/NotHasMore/Index';
import IndicatorDownNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...IndicatorDownColumnScroll.getLoadConfig(),
            ...IndicatorDownEnoughDataHasMore.getLoadConfig(),
            ...IndicatorDownNotEnoughDataHasMore.getLoadConfig(),
            ...IndicatorDownEnoughDataNotHasMore.getLoadConfig(),
            ...IndicatorDownNotEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
