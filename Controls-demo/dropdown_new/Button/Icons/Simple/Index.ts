import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/Icons/Simple/Index');
import { RecordSet } from 'Types/collection';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    icon: 'icon-EmptyMessage',
                    title: 'Сообщение',
                },
                {
                    key: '2',
                    title: 'Отчет',
                },
                {
                    key: '3',
                    icon: 'icon-TFTask',
                    title: 'Задача',
                },
                {
                    key: '4',
                    icon: 'icon-News',
                    title: 'Новость',
                },
                {
                    key: '5',
                    title: 'Заметка',
                },
            ],
        });
    }
}
