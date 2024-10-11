import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Combobox/PlaceholderVisibility/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;
    protected _emptySource: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Ярославль' },
                { key: 2, title: 'Москва' },
                { key: 3, title: 'Санкт-Петербург' },
            ],
        });
        this._emptySource = new Memory({
            keyProperty: 'key',
            data: [],
        });
    }
}
