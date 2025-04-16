import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Input/IconStyle/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;
    protected _selectedKeys: number[] = [1];
    protected _selectedKeys2: number[] = [1];
    protected _selectedKeys3: number[] = [1];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'С компьютера', icon: 'icon-TFComputer' },
                { key: 2, title: 'Из документов', icon: 'icon-Unfavorite' },
                { key: 3, title: 'Из коллекции', icon: 'icon-Album' },
            ],
        });
    }
}
