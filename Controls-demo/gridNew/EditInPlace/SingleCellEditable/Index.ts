import {Control, TemplateFunction} from 'UI/Base';
import {Memory} from 'Types/source';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/SingleCellEditable';
import * as cellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/cellTemplate';
import * as firstCellTemplate from 'wml!Controls-demo/gridNew/EditInPlace/SingleCellEditable/firstCellTemplate';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IColumnRes } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';
import { Editing } from 'Controls-demo/gridNew/DemoHelpers/Data/Editing';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _viewSource: Memory;
    private _itemActions: IItemAction[];
    private _columns: IColumnRes[];

    protected _beforeMount(): void {
        this._setViewSource();
        this._setColumns();
        this._setItemActions();
    }

    private _setViewSource(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Editing.getEditingData()
        });
    }

    private _setColumns(): void {
        this._columns = Editing.getEditingColumns().map((column, index) => ({
            ...column,
            editable: index === 0 || index === 3 ? false : undefined,
            template: !(index === 0 || index === 3) ? cellTemplate : undefined
        }));
        this._columns[0].template = firstCellTemplate;
    }

    private _setItemActions(): void {
        this._itemActions = [{
            id: 1,
            icon: 'icon-Erase icon-error',
            title: 'delete',
            showType: TItemActionShowType.TOOLBAR
        }];
    }

    _onBeforeBeginEdit(options, item, isAdd, columnIndex) {
        if (columnIndex === 0 || columnIndex === 3){
            return 'Cancel';
        }
    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
