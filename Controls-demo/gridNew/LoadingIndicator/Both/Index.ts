import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/Both';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorBothEnoughData from 'Controls-demo/gridNew/LoadingIndicator/Both/EnoughData/Index';
import LoadingIndicatorBothNotEnoughData from 'Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/Index';
import LoadingIndicatorBothHasHeaderAndFooter from 'Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndFooter/Index';
import LoadingIndicatorBothHasHeaderAndResults from 'Controls-demo/gridNew/LoadingIndicator/Both/HasHeaderAndResults/Index';
import LoadingIndicatorBothScrolled from 'Controls-demo/gridNew/LoadingIndicator/Both/Scrolled/Index';
import LoadingIndicatorBothScrolledToEnd from 'Controls-demo/gridNew/LoadingIndicator/Both/ScrolledToEnd/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorBothEnoughData.getLoadConfig(),
            ...LoadingIndicatorBothNotEnoughData.getLoadConfig(),
            ...LoadingIndicatorBothHasHeaderAndFooter.getLoadConfig(),
            ...LoadingIndicatorBothHasHeaderAndResults.getLoadConfig(),
            ...LoadingIndicatorBothScrolled.getLoadConfig(),
            ...LoadingIndicatorBothScrolledToEnd.getLoadConfig(),
            ...LoadingIndicatorBothSearch.getLoadConfig(),
        };
    }
}
