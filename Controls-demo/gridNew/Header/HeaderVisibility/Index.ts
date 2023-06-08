import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Header/HeaderVisibility/HeaderVisibility';

import Default from 'Controls-demo/gridNew/Header/HeaderVisibility/Default/Index';
import DefaultAndResult from 'Controls-demo/gridNew/Header/HeaderVisibility/DefaultAndResult/Index';
import Visible from 'Controls-demo/gridNew/Header/HeaderVisibility/Visible/Index';
import VisibleAndResult from 'Controls-demo/gridNew/Header/HeaderVisibility/VisibleAndResult/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...DefaultAndResult.getLoadConfig(),
            ...Visible.getLoadConfig(),
            ...VisibleAndResult.getLoadConfig(),
        };
    }
}
