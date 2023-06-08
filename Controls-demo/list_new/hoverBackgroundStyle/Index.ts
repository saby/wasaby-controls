import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction } from 'Controls/itemActions';
import { TBackgroundStyle } from 'Controls/interface';

import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/list_new/hoverBackgroundStyle/hoverBackgroundStyle';

export default class extends Control {
    protected _itemActions: IItemAction[] = getItemActions().slice(1);
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _hoverBackgroundStyle: TBackgroundStyle;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
        this._hoverBackgroundStyle = 'primary';
    }

    protected _toggleHoverBackground() {
        this._hoverBackgroundStyle =
            this._hoverBackgroundStyle === 'primary' ? 'success' : 'primary';
    }

    static _styles: string[] = [
        'Controls-demo/list_new/hoverBackgroundStyle/hoverBackgroundStyle',
    ];
}
