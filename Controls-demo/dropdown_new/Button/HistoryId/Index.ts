import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/HistoryId/Index');
import {Memory} from 'Types/source';
import {getItems, overrideOrigSourceMethod, resetHistory} from './Utils';
import {IItemAction, TItemActionShowType} from 'Controls/itemActions';
import {Service, Source} from 'Controls/historyOld';

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
                historyId: 'TEST_HISTORY_ID'
            }),
            originSource: new Memory({
                keyProperty: 'key',
                data: getItems(),
            }),
            parentProperty: 'parent',
            nodeProperty: '@parent',
        });

        this._sourceItemActions = new Source({
            historySource: new Service({
                pinned: true,
                frequent: true,
                historyId: 'TEST_HISTORY_ID'
            }),
            originSource: new Memory({
                keyProperty: 'key',
                data: getItems(),
            }),
            parentProperty: 'parent',
            nodeProperty: '@parent',
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
