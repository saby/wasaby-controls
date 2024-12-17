import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import * as Template from 'wml!Controls-demo/LookupNew/SelectorButton/ShowClearButton/ShowClearButton';
import { COMPANIES } from 'Controls-demo/LookupNew/resources/DataStorage';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _source: Memory;
    protected _selectedKeys: string[];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: COMPANIES,
        });

        this._selectedKeys = ['Иванова Зинаида Михайловна, ИП', 'Ромашка, ООО'];
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
