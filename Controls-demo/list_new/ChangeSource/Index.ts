import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { TKey } from 'Controls/interface';
import { IItemAction } from 'Controls/itemActions';

import {
    getFewCategories as getListData,
    getContactsCatalogWithActions,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsWithSVG as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as controlTemplate from 'wml!Controls-demo/list_new/ChangeSource/ChangeSource';

/**
 * Демка для тестирования случая, когда меняют source + itemActions + ItemActionsProperty.
 * Не должно быть ошибок в консоли.
 */
class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: TKey[] = [];
    protected _excludedKeys: TKey[] = [];
    protected _itemActionsProperty: string;
    protected _itemActions: IItemAction[];
    protected _viewSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._itemActions = getItemActions();
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getListData(),
        });
    }

    _toggleEnableActionProperty(): void {
        this._itemActionsProperty =
            this._itemActionsProperty === undefined ? 'itemActions' : undefined;
        this._itemActions =
            this._itemActionsProperty === undefined
                ? getItemActions()
                : undefined;
        if (this._itemActionsProperty === undefined) {
            this._viewSource = new Memory({
                keyProperty: 'key',
                data: getListData(),
            });
        } else {
            this._viewSource = new Memory({
                keyProperty: 'key',
                data: getContactsCatalogWithActions(),
            });
        }
    }
}

export default Demo;
