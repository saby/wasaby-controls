import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplate';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemTemplateBackgroundColorStyle from 'Controls-demo/list_new/ItemTemplate/BackgroundColorStyle/Index';
import ItemTemplateBorderVisibility from 'Controls-demo/list_new/ItemTemplate/BorderVisibility/Index';
import ItemTemplateClickable from 'Controls-demo/list_new/ItemTemplate/Clickable/Index';
import ItemTemplateCustomContent from 'Controls-demo/list_new/ItemTemplate/CustomContent/Index';
import ItemTemplateCheckboxReadOnly from 'Controls-demo/list_new/ItemTemplate/CheckboxReadOnly/Index';
import ItemTemplateCustomHoverArea from 'Controls-demo/list_new/ItemTemplate/CustomHoverArea/Index';
import ItemTemplateDisplayProperty from 'Controls-demo/list_new/ItemTemplate/DisplayProperty/Index';
import ItemTemplateFromFile from 'Controls-demo/list_new/ItemTemplate/FromFile/Index';
import ItemTemplateFontColorStyle from 'Controls-demo/list_new/ItemTemplate/FontColorStyle/Index';
import ItemTemplateHandlers from 'Controls-demo/list_new/ItemTemplate/Handlers/Index';
import ItemTemplatehoverBackgroundStyle from 'Controls-demo/list_new/ItemTemplate/hoverBackgroundStyle/Index';
import ItemTemplateItemActionsClass from 'Controls-demo/list_new/ItemTemplate/ItemActionsClass/Index';
import ItemTemplateMarker from 'Controls-demo/list_new/ItemTemplate/Marker/Index';
import ItemTemplateMultiSelectAccessibilityProperty from 'Controls-demo/list_new/ItemTemplate/MultiSelectAccessibilityProperty/Index';
import ItemTemplateNoHighlightOnHover from 'Controls-demo/list_new/ItemTemplate/NoHighlightOnHover/Index';
import ItemTemplateItemTemplateProperty from 'Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemTemplateBackgroundColorStyle.getLoadConfig(),
            ...ItemTemplateBorderVisibility.getLoadConfig(),
            ...ItemTemplateClickable.getLoadConfig(),
            ...ItemTemplateCustomContent.getLoadConfig(),
            ...ItemTemplateCheckboxReadOnly.getLoadConfig(),
            ...ItemTemplateCustomHoverArea.getLoadConfig(),
            ...ItemTemplateDisplayProperty.getLoadConfig(),
            ...ItemTemplateFromFile.getLoadConfig(),
            ...ItemTemplateFontColorStyle.getLoadConfig(),
            ...ItemTemplateHandlers.getLoadConfig(),
            ...ItemTemplatehoverBackgroundStyle.getLoadConfig(),
            ...ItemTemplateItemActionsClass.getLoadConfig(),
            ...ItemTemplateMarker.getLoadConfig(),
            ...ItemTemplateMultiSelectAccessibilityProperty.getLoadConfig(),
            ...ItemTemplateNoHighlightOnHover.getLoadConfig(),
            ...ItemTemplateItemTemplateProperty.getLoadConfig(),
        };
    }
}
