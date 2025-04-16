import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/NotEnoughData';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import IndicatorDownNotEnoughDataHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/HasMore/Index';
import IndicatorDownNotEnoughDataNotHasMore from 'Controls-demo/gridNew/LoadingIndicator/Down/NotEnoughData/NotHasMore/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...IndicatorDownNotEnoughDataHasMore.getLoadConfig(),
            ...IndicatorDownNotEnoughDataNotHasMore.getLoadConfig(),
        };
    }
}
