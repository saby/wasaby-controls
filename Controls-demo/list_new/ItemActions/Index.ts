import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ItemActionsBase from 'Controls-demo/list_new/ItemActions/Base/Index';
import ItemActionsContextMenuConfig from 'Controls-demo/list_new/ItemActions/ContextMenuConfig/Index';
import ItemActionsContextMenuVisibility from 'Controls-demo/list_new/ItemActions/ContextMenuVisibility/Index';
import ItemActionsDisplayMode from 'Controls-demo/list_new/ItemActions/DisplayMode/Index';
import ItemActionsDelete from 'Controls-demo/list_new/ItemActions/Delete/Index';
import ItemActionClickHandler from 'Controls-demo/list_new/ItemActions/ItemActionClickHandler/Index';
import ItemActionsEditingConfig from 'Controls-demo/list_new/ItemActions/ItemActionsEditingConfig/Index';
import ItemActionsIconSize from 'Controls-demo/list_new/ItemActions/ItemActionsIconSize/Index';
import ItemActionsNoHighlightOnHover from 'Controls-demo/list_new/ItemActions/ItemActionsNoHighlightOnHover/Index';
import ItemActionsParent from 'Controls-demo/list_new/ItemActions/ItemActionsParent/Index';
import ItemActionsPosition from 'Controls-demo/list_new/ItemActions/ItemActionsPosition/Index';
import ItemActionsVisibility from 'Controls-demo/list_new/ItemActions/ItemActionsVisibility/Index';
import ItemActionsProperty from 'Controls-demo/list_new/ItemActions/ItemActionsProperty/Index';
import ItemActionVisibilityCallback from 'Controls-demo/list_new/ItemActions/ItemActionVisibilityCallback/Index';
import ItemActionsSetItemActions from 'Controls-demo/list_new/ItemActions/SetItemActions/Index';
import ItemActionsviewMode from 'Controls-demo/list_new/ItemActions/viewMode/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ItemActionsBase.getLoadConfig(),
            ...ItemActionsContextMenuConfig.getLoadConfig(),
            ...ItemActionsContextMenuVisibility.getLoadConfig(),
            ...ItemActionsDisplayMode.getLoadConfig(),
            ...ItemActionsDelete.getLoadConfig(),
            ...ItemActionClickHandler.getLoadConfig(),
            ...ItemActionsEditingConfig.getLoadConfig(),
            ...ItemActionsIconSize.getLoadConfig(),
            ...ItemActionsNoHighlightOnHover.getLoadConfig(),
            ...ItemActionsParent.getLoadConfig(),
            ...ItemActionsPosition.getLoadConfig(),
            ...ItemActionsVisibility.getLoadConfig(),
            ...ItemActionsProperty.getLoadConfig(),
            ...ItemActionVisibilityCallback.getLoadConfig(),
            ...ItemActionsSetItemActions.getLoadConfig(),
            ...ItemActionsviewMode.getLoadConfig(),
        };
    }
}
