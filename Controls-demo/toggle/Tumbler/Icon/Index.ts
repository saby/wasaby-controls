import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Icon/ItemTemplate';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _items1: RecordSet;
    protected _items2: RecordSet;
    protected _selectedKey: string = '1';
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '1';

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    icon: 'icon-Send',
                },
                {
                    id: '2',
                    icon: 'icon-SabyBird',
                },
            ],
            keyProperty: 'id',
        });
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Сообщения',
                    counter: 12,
                },
                {
                    id: '2',
                    caption: 'Задачи',
                    counter: 5,
                },
            ],
            keyProperty: 'id',
        });
        this._items2 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Оправить',
                    icon: 'icon-Send',
                    counter: 12,
                },
                {
                    id: '2',
                    caption: 'Получить',
                    icon: 'icon-Gift',
                    counter: 5,
                },
            ],
            keyProperty: 'id',
        });
    }
}
