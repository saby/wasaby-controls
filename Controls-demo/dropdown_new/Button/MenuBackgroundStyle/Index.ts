import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/MenuBackgroundStyle/Index');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import 'css!Controls-demo/dropdown_new/Button/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedTitle: string = '';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: '1',
                    icon: 'icon-Check2',
                    title: 'Инвертировать',
                },
                {
                    key: '2',
                    title: 'Показать отмеченные',
                },
                {
                    key: '3',
                    icon: 'icon-Show',
                    title: 'Прочитано',
                },
                {
                    key: '4',
                    icon: 'icon-Tag',
                    title: 'Пометки',
                },
                {
                    key: '5',
                    icon: 'icon-Move',
                    title: 'Перенести',
                },
                {
                    key: '6',
                    icon: 'icon-Erase',
                    iconStyle: 'danger',
                    title: 'Удалить',
                },
            ],
        });
    }
    protected _menuItemActivate(event: Event, item: Model): void {
        this._selectedTitle = item.get('title');
    }
}
