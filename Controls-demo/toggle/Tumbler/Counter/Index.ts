import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Counter/Template';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKey: string = '1';

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Смартфоны',
                    count: 10,
                    mainCounter: 123,
                },
                {
                    id: '2',
                    caption: 'Планшеты',
                    mainCounter: 54,
                },
                {
                    id: '3',
                    caption: 'Ноутбуки',
                },
            ],
        });
    }
}
