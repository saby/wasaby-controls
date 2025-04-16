import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/Items/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Confirmation } from 'Controls/popup';
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
    protected _menuItemActivate(event: Event, item: Model): void {
        Confirmation.openPopup({
            type: 'ok',
            message: `Клик по: "${item.get('title')}"`,
        });
    }
}
