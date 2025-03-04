import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ItemTemplate/ItemTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemTemplateBackgroundColorStyle from 'Controls-demo/gridNew/ItemTemplate/BackgroundColorStyle/Index';
import ItemTemplateCustomClass from 'Controls-demo/gridNew/ItemTemplate/CustomClass/Index';
import ItemTemplateFromFile from 'Controls-demo/gridNew/ItemTemplate/FromFile/Index';
import ItemTemplateNoClickable from 'Controls-demo/gridNew/ItemTemplate/NoClickable/Index';
import ItemTemplateNoHighlight from 'Controls-demo/gridNew/ItemTemplate/NoHighlight/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemTemplateBackgroundColorStyle.getLoadConfig(),
            ...ItemTemplateCustomClass.getLoadConfig(),
            ...ItemTemplateFromFile.getLoadConfig(),
            ...ItemTemplateNoClickable.getLoadConfig(),
            ...ItemTemplateNoHighlight.getLoadConfig(),
        };
    }
}
