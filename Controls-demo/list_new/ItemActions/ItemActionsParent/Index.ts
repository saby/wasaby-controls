import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemActions/ItemActionsParent/ItemActionsParent';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { getContactsCatalog } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

/**
 * Для документации https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/show-type/#hierarchy-support
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._itemActions = [
            {
                id: 1,
                title: 'Show',
                showType: TItemActionShowType.MENU,
                parent: null,
                'parent@': false,
            },
            {
                id: 2,
                title: 'Edit',
                showType: TItemActionShowType.MENU,
                parent: null,
                'parent@': true,
            },
            {
                id: 3,
                title: 'Edit description',
                showType: TItemActionShowType.MENU,
                parent: 2,
                'parent@': null,
            },
        ];
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getContactsCatalog(),
        });
    }
}
