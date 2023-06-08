import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import { getActionsWithSVG as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { getContactsCatalog } from '../../DemoHelpers/DataCatalog';

import * as Template from 'wml!Controls-demo/list_new/ItemActions/SetItemActions/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[];
    protected _itemActionsEnabled: boolean = false;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getContactsCatalog(),
        });
    }

    protected _itemActionsEnabledChanged(
        event: SyntheticEvent,
        state: boolean
    ): void {
        if (state) {
            this._itemActions = getItemActions();
        } else {
            this._itemActions = null;
        }
    }
}
