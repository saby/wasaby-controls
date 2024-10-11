import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/RadioGroup/Multiline/Template');
import { RecordSet } from 'Types/collection';

export default class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey1: number = 1;
    protected _selectedKey2: number = 1;
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 1,
                title: 'Отправить по E-mail',
            },
            {
                id: 2,
                title: 'Отправить в VK',
            },
            {
                id: 3,
                title: 'Отправить в OK',
            },
            {
                id: 4,
                title: 'Отправить по Telegram',
            },
            {
                id: 5,
                title: 'Отправить по СМС',
            },
        ],
    });
}
