import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Combobox/MenuPopupWidth/Index';
import { Memory } from 'Types/source';
import { IMenuPopupOptions } from 'Controls/menu';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _menuPopupOptions: IMenuPopupOptions;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._menuPopupOptions = {
            width: 500,
        };
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Ярославль' },
                { key: 2, title: 'Москва' },
                { key: 3, title: 'Санкт-Петербург длинное название города' },
            ],
        });
    }
}
