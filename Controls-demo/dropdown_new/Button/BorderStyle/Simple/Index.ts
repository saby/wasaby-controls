import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dropdown_new/Button/BorderStyle/Simple/Index';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: 1,
                    title: 'Bitrix24',
                },
                {
                    key: 2,
                    title: 'AmoCRM',
                },
                {
                    key: 3,
                    title: 'Мегаплан',
                },
                {
                    key: 4,
                    title: 'Из файла',
                },
            ],
        });
    }
}
