import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import Template = require('wml!Controls-demo/toggle/RadioGroup/CustomItemTemplate/Template');
import itemTemplate = require('wml!Controls-demo/toggle/RadioGroup/CustomItemTemplate/resources/SingleItemTemplate');

class CustomItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _itemTemplate: TemplateFunction = itemTemplate;
    protected _selectedKey: string = '1';
    protected _selectedKey2: string = '1';
    protected _items1: RecordSet;
    protected _items2: RecordSet;
    protected _displayProperty: string = 'caption';

    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                    caption: 'Additional caption1',
                },
                {
                    id: '2',
                    title: 'Item 2',
                    caption: 'Additional caption2',
                    templateTwo:
                        'wml!Controls-demo/toggle/RadioGroup/CustomItemTemplate/resources/SingleItemTemplate',
                },
                {
                    id: '3',
                    title: 'Item 3',
                    caption: 'Additional caption3',
                },
            ],
        });
        this._items2 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Оплата по терминалу в точке продаж',
                    text: 'Заключите договор с банком о предоставлении в аренду эквайринговых терминалов.',
                },
                {
                    id: '2',
                    title: 'Онлайн-оплата через интернет',
                    text: 'Включите возможность приема онлайн-оплат для выставленных счетов или для бронирования',
                },
                {
                    id: '3',
                    title: 'QR-код',
                    text: 'Подключите возможность оплаты по счету в ресторане с помощью графического кода.',
                },
            ],
        });
    }
}

export default CustomItemTemplate;
