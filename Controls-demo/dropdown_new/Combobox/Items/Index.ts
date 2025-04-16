import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Combobox/Items/Index';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, title: 'Ярославль' },
                { key: 2, title: 'Москва' },
                { key: 3, title: 'Санкт-Петербург' },
            ],
        });
    }
}
