import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { TColspanCallbackResult } from 'Controls/grid';

import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/list_new/ItemTemplate/CustomHoverArea/CustomHoverArea';

import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/CustomHoverArea/CustomHoverArea';
import { getFewCategories } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const MAXINDEX = 4;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getFewCategories().slice(1, MAXINDEX),
        });
    }

    protected _colspanCallback(): TColspanCallbackResult {
        return 'end';
    }
}
