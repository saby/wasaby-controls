import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/SelectedItems/Index');
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';

const items = [
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
];

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: string[] = ['1'];
    protected _selectedItems: RecordSet = new RecordSet({
        keyProperty: 'key',
        rawData: [items[0]],
    });
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: items,
        });
    }

    protected _selectedKeysChanged(event: Event, keys: string[]): void {
        this._selectedKeys = keys;
    }
}
