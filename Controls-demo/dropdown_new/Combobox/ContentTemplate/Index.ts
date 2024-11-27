import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/dropdown_new/Combobox/ContentTemplate/Index';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/dropdown_new/Combobox/ContentTemplate/ContentTemplate';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [
                { key: 1, title: 'Разработка', secondTitle: 'тест1' },
                { key: 2, title: 'Продвижение', secondTitle: 'тест2' },
                { key: 3, title: 'Тестирование', secondTitle: 'тест3' },
            ],
        });
    }
}
