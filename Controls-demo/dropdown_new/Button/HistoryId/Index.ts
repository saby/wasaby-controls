import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/HistoryId/Index');
import { Memory } from 'Types/source';
import { getItemsDoNotSaveToHistory } from 'Controls-demo/dropdown_new/resources/Data';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Service, Source } from 'Controls/historyOld';

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
        this._source = new Source({
            historySource: new Service({
                pinned: true,
                frequent: true,
                historyId: 'TEST_HISTORY_ID',
            }),
            originSource: new Memory({
                keyProperty: 'key',
                data: getItemsDoNotSaveToHistory(),
            }),
            parentProperty: 'parent',
            nodeProperty: '@parent',
        });

        this._sourceItemActions = new Source({
            historySource: new Service({
                pinned: true,
                frequent: true,
                historyId: 'TEST_HISTORY_ID',
            }),
            originSource: new Memory({
                keyProperty: 'key',
                data: getItemsDoNotSaveToHistory(),
            }),
            parentProperty: 'parent',
            nodeProperty: '@parent',
        });
    }

    static _styles: string[] = ['Controls-demo/dropdown_new/Button/Index'];
}

export default HeaderContentTemplate;
