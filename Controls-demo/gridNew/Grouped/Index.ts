import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Grouped/Grouped';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import GroupedCustom from 'Controls-demo/gridNew/Grouped/Custom/Index';
import GroupedWithEditing from 'Controls-demo/gridNew/Grouped/WithEditing/Index';
import GroupedgroupHistoryId from 'Controls-demo/gridNew/Grouped/groupHistoryId/Index';
import GroupedHiddenGroup from 'Controls-demo/gridNew/Grouped/HiddenGroup/Index';
import RightTemplate from 'Controls-demo/gridNew/Grouped/RightTemplate/Index';
import GroupedSeparatorVisibility from 'Controls-demo/gridNew/Grouped/SeparatorVisibility/Index';
import GroupedTextAlign from 'Controls-demo/gridNew/Grouped/TextAlign/Index';
import GroupedTextVisible from 'Controls-demo/gridNew/Grouped/TextVisible/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...GroupedCustom.getLoadConfig(),
            ...GroupedWithEditing.getLoadConfig(),
            ...GroupedgroupHistoryId.getLoadConfig(),
            ...GroupedHiddenGroup.getLoadConfig(),
            ...RightTemplate.getLoadConfig(),
            ...GroupedSeparatorVisibility.getLoadConfig(),
            ...GroupedTextAlign.getLoadConfig(),
            ...GroupedTextVisible.getLoadConfig(),
        };
    }
}
