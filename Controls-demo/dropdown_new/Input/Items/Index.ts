import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/Items/Index');
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: string[] = ['1'];
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    title: 'Сообщение',
                },
                {
                    key: '2',
                    title: 'Отчет',
                },
                {
                    key: '3',
                    title: 'Задача',
                },
                {
                    key: '4',
                    title: 'Новости',
                },
                {
                    key: '5',
                    title: 'Заметки',
                },
            ],
        });
    }
    protected _selectedKeysChanged(event: Event, keys: string[]): void {
        this._selectedKeys = keys;
    }
}
