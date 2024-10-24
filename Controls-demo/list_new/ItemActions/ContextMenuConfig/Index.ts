import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import FooterTemplate from 'Controls-demo/list_new/ItemActions/ContextMenuConfig/FooterTemplate/Index';
import HeaderTemplate from 'Controls-demo/list_new/ItemActions/ContextMenuConfig/HeaderTemplate/Index';
import ItemTemplate from 'Controls-demo/list_new/ItemActions/ContextMenuConfig/ItemTemplate/Index';

import * as Template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/ContextMenuConfig';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...FooterTemplate.getLoadConfig(),
            ...HeaderTemplate.getLoadConfig(),
            ...ItemTemplate.getLoadConfig(),
        };
    }
}
