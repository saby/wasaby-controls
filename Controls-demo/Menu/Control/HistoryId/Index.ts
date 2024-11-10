import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/HistoryId/Index');
import HistorySourceMenu from './historySourceMenu';

class MenuHistoryId extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: HistorySourceMenu;

    protected _beforeMount(): void {
        this._source = new HistorySourceMenu({
            keyProperty: 'key',
        });
    }

    static _styles: string[] = ['Controls-demo/Menu/Menu'];
}

export default MenuHistoryId;
