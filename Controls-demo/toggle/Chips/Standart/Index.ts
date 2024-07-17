import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/Standart/Template';
import { RecordSet } from 'Types/collection';

export default class Base extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['1'];
    protected _selectedKeys3: string[] = ['1'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Мои',
                },
                {
                    id: '2',
                    caption: 'Отвечаю',
                },
                {
                    id: '3',
                    caption: 'Готовые',
                },
            ],
            keyProperty: 'id',
        });
    }
}
