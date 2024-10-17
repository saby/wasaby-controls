import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/ItemTemplateDoc/itemTemplate';
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
                    caption: 'Ошибки',
                    info: '12 шт.',
                    counter: 500,
                    color: 'danger',
                },
                {
                    id: '2',
                    caption: 'Задачи',
                    info: '3 шт.',
                    counter: 100,
                    color: 'warning',
                },
                {
                    id: '3',
                    caption: 'Поручения',
                    info: 'нет',
                    counter: 200,
                    color: 'info',
                },
            ],
            keyProperty: 'id',
        });
    }
}
