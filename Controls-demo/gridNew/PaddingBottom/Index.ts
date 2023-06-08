// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/gridNew/PaddingBottom/Index';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Control, TemplateFunction } from 'UI/Base';
import { Countries } from '../DemoHelpers/Data/Countries';
import { IItemAction } from 'Controls/interface';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

/**
 * Демка проверяет простановку нижнего отступа у GridView когда заданы itemActions в позиции outside
 * и подгрузка данных по кнопке "Еще..."
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _itemActions: IItemAction[];

    protected _beforeMount(): void {
        this._itemActions = getItemActions();
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(0, 6),
        });
    }
}
