import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Header/HeaderVisibility/HeaderVisibility';

import HeaderVisibilityDefault from 'Controls-demo/gridNew/Header/HeaderVisibility/Default/Index';
import HeaderVisibilityDefaultAndResult from 'Controls-demo/gridNew/Header/HeaderVisibility/DefaultAndResult/Index';
import HeaderVisibilityVisible from 'Controls-demo/gridNew/Header/HeaderVisibility/Visible/Index';
import HeaderVisibilityVisibleAndResult from 'Controls-demo/gridNew/Header/HeaderVisibility/VisibleAndResult/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...HeaderVisibilityDefault.getLoadConfig(),
            ...HeaderVisibilityDefaultAndResult.getLoadConfig(),
            ...HeaderVisibilityVisible.getLoadConfig(),
            ...HeaderVisibilityVisibleAndResult.getLoadConfig(),
        };
    }
}
