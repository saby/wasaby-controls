import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-demo/LookupNew/SelectorButton/ReadOnly/Index';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _source: Memory;
    protected _selectedKeys: string[];
    protected _selectedKeys1: string[] = ['Иванова Зинаида Михайловна, ИП'];
    protected _selectedKeysMulti: string[] = [
        'Наша компания',
        'Все юридические лица',
        'Инори, ООО',
    ];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: COMPANIES,
        });
    }
}
