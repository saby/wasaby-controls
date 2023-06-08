import { IItemAction } from 'Controls/itemActions';
import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/ItemActionsClass/ItemActionsClass';
import { Memory } from 'Types/source';
import { getContactsCatalog as getData } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction = getItemActions();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }
}
