import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';

import { getColorsData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/hoverBackgroundStyle/hoverBackgroundStyle';
import { TBackgroundStyle } from 'Controls/interface';

export default class extends Control {
    protected _itemActions: IItemAction[] = getItemActions().slice(1);
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _hoverBackgroundStyle: TBackgroundStyle;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getColorsData(),
        });
        this._hoverBackgroundStyle = 'primary';
    }
}
