import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/LoadingIndicator/LoadingIndicator';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import LoadingIndicatorCenter from 'Controls-demo/list_new/LoadingIndicator/Center/Index';
import LoadingIndicatorDown from 'Controls-demo/list_new/LoadingIndicator/Down/Index';
import LoadingIndicatorGlobal from 'Controls-demo/list_new/LoadingIndicator/Global/Index';
import LoadingIndicatorUp from 'Controls-demo/list_new/LoadingIndicator/Up/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...LoadingIndicatorCenter.getLoadConfig(),
            ...LoadingIndicatorDown.getLoadConfig(),
            ...LoadingIndicatorGlobal.getLoadConfig(),
            ...LoadingIndicatorUp.getLoadConfig(),
        };
    }
}
