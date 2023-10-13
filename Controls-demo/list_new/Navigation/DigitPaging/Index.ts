import {Control, TemplateFunction} from 'UI/Base';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/Navigation/DigitPaging/DigitPaging';

import WithScroll from 'Controls-demo/list_new/Navigation/DigitPaging/WithScroll/Index';
import WithoutScroll from 'Controls-demo/list_new/Navigation/DigitPaging/WithoutScroll/Index';
import WithItemActions from 'Controls-demo/list_new/Navigation/DigitPaging/WithItemActions/Index';
import MinElements from 'Controls-demo/list_new/Navigation/DigitPaging/MinElements/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithScroll.getLoadConfig(),
            ...WithoutScroll.getLoadConfig(),
            ...WithItemActions.getLoadConfig(),
            ...MinElements.getLoadConfig(),
        };
    }
}
