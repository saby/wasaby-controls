import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import Template = require('wml!Controls-demo/toggle/RadioGroup/Standart/Template');

export default class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _itemsParent: RecordSet;

    protected _selectedKey1: string = 1;
    protected _selectedKey2: string = 1;
    protected _selectedKey3: string = 1;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Отправить в VK',
                },
                {
                    id: 2,
                    title: 'Отправить в OK',
                },
                {
                    id: 3,
                    title: 'Отправить в Telegram',
                },
            ],
        });
        this._itemsParent = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: 1,
                    title: 'Отправлять по СМС',
                    parent: null,
                    node: false,
                },
                {
                    id: 2,
                    title: 'Отправлять в соц. сети',
                    parent: null,
                    node: true,
                },
                {
                    id: 3,
                    title: 'VK',
                    parent: 2,
                    node: false,
                },
                {
                    id: 4,
                    title: 'OK',
                    parent: 2,
                    node: false,
                },
                {
                    id: 5,
                    title: 'Telegram',
                    parent: 2,
                    node: false,
                },
                {
                    id: 6,
                    title: 'Отправлять по E-mail',
                    parent: null,
                    node: false,
                },
            ],
        });
    }
}
