import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-Buttons-demo/ListButton/Template');
import { RecordSet } from 'Types/collection';
import 'wml!Controls-Buttons-demo/ListButton/resources/template';

export default class ListButton extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet = null;
    protected _menuOptions: Object;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 0,
                    title: 'Калорийность',
                    additionalText: 'Белки, жиры, углеводы',
                    template: 'wml!Controls-Buttons-demo/ListButton/resources/template',
                },
                {
                    id: 1,
                    title: 'Размеры',
                    additionalText: 'Длинна, ширина, высота',
                    template: 'wml!Controls-Buttons-demo/ListButton/resources/template',
                },
                {
                    id: 2,
                    title: 'Производитель',
                    additionalText: 'Страна, адрес, реквизиты',
                    template: 'wml!Controls-Buttons-demo/ListButton/resources/template',
                },
            ],
        });

        this._menuOptions = {
            items: this._items,
            itemTemplateProperty: 'template',
            keyProperty: 'id',
        };
    }
}
