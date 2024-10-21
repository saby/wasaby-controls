import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/Counter/itemTemplate';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKeys: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Смартфоны',
                    counter: 123,
                    color: 'danger',
                },
                {
                    id: '2',
                    caption: 'Планшеты',
                    counter: 54,
                    color: 'warning',
                },
                {
                    id: '3',
                    caption: 'Ноутбуки',
                    counter: 27,
                    color: 'info',
                },
            ],
            keyProperty: 'id',
        });
    }
}
