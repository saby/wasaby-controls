import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/FooterTemplate/MinHeight/MinHeight';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import 'css!Controls-demo/list_new/FooterTemplate/MinHeight/MinHeight';
import 'css!Controls/CommonClasses';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }
}
