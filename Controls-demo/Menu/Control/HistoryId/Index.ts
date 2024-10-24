import {Control, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/HistoryId/Index');
import {getItems} from './historySourceMenu';
import {Service, Source} from 'Controls/historyOld';
import {Memory} from 'Types/source';

class MenuHistoryId extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Source;

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
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}

export default MenuHistoryId;
