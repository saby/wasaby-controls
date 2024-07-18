import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/HistoryId/Index');
import { Memory } from 'Types/source';
import { getItems, overrideOrigSourceMethod, resetHistory } from './Utils';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

class HeaderContentTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;
    protected _sourceItemActions: Memory;
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Edit',
            iconStyle: 'secondary',
            title: 'edit',
            showType: TItemActionShowType.MENU,
        },
        {
            id: 2,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            showType: TItemActionShowType.MENU,
        },
    ];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: getItems(),
        });
        this._sourceItemActions = new Memory({
            keyProperty: 'key',
            data: getItems(),
        });
    }

    protected _afterMount(): void {
        overrideOrigSourceMethod();
    }

    protected _beforeUnmount(): void {
        resetHistory();
    }
    static _styles: string[] = ['Controls-demo/dropdown_new/Button/Index'];
}
export default HeaderContentTemplate;
