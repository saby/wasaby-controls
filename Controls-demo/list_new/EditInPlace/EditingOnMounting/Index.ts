import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/EditingOnMounting/EditingOnMounting';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import { getActionsForContacts as getItemActions } from '../../DemoHelpers/ItemActionsCatalog';
import { IItemAction } from 'Controls/itemActions';
import { IEditingConfig } from 'Controls/display';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[] = getItemActions();
    private _viewSource: Memory;
    private _newData: unknown = getData().slice(0, 1);
    protected _editingConfig: IEditingConfig = null;
    protected _beforeMount(): Promise<void> {
        this._newData[0].key = 1;

        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._newData,
        });
        return this._viewSource.read(1).then((record) => {
            this._editingConfig = {
                toolbarVisibility: true,
                item: record,
                editOnClick: true,
            };
        });
    }
}
