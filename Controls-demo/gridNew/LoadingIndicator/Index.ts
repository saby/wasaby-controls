import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/LoadingIndicator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorBothEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/HasMore/Index';
import LoadingIndicatorBothEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/NotHasMore/Index';
import LoadingIndicatorBothHasHeaderAndFooter from 'Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndFooter/Index';
import LoadingIndicatorBothHasHeaderAndResults from 'Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndResults/Index';
import LoadingIndicatorBothNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotHasMore/Index';
import LoadingIndicatorBothNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/HasMore/Index';
import LoadingIndicatorBothScrolled from 'Controls-demo/gridNew/LoadingIndicator/Both/Scrolled/Index';
import LoadingIndicatorBothScrolledToEnd from 'Controls-demo/gridNew/LoadingIndicator/Both/ScrolledToEnd/Index';
import IndicatorDownEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/HasMore/Index';
import IndicatorDownNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/HasMore/Index';
import LoadingIndicatorUpEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/HasMore/Index';
import LoadingIndicatorUpEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/EnoughData/NotHasMore/Index';
import LoadingIndicatorUpNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/HasMore/Index';
import LoadingIndicatorMiddleColumnScroll from 'Controls-demo/gridNew/LoadingIndicator/Middle/ColumnScroll/Index';
import LoadingIndicatorUpNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Up/NotEnoughData/NotHasMore/Index';
import LoadingIndicatorUpVirtualPageSize from 'Controls-demo/gridNew/LoadingIndicator/Up/VirtualPageSize/Index';
import IndicatorDownEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/EnoughData/NotHasMore/Index';
import IndicatorDownNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorBothEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorBothEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorBothHasHeaderAndFooter.getLoadConfig(),
            ...LoadingIndicatorBothHasHeaderAndResults.getLoadConfig(),
            ...LoadingIndicatorBothNotEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorBothNotEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorBothScrolled.getLoadConfig(),
            ...LoadingIndicatorBothScrolledToEnd.getLoadConfig(),
            ...LoadingIndicatorBothSearch.getLoadConfig(),
            ...IndicatorDownColumnScroll.getLoadConfig(),
            ...IndicatorDownEnoughDataHasMore.getLoadConfig(),
            ...IndicatorDownNotEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorUpEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorUpNotEnoughDataHasMore.getLoadConfig(),
            ...LoadingIndicatorMiddleColumnScroll.getLoadConfig(),
            ...LoadingIndicatorUpNotEnoughDataNotHasMore.getLoadConfig(),
            ...LoadingIndicatorUpVirtualPageSize.getLoadConfig(),
            ...IndicatorDownEnoughDataNotHasMore.getLoadConfig(),
            ...IndicatorDownNotEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
