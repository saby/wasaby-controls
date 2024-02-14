import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/ItemTemplate/Simple/Index');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: '1', title: 'Ярославль', code: '76' },
                { key: '2', title: 'Москва', code: '77' },
                { key: '3', title: 'Санкт-Петербург', code: '78' },
            ],
        });
    }
}
