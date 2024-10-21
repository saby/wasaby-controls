import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/Base/Template');
import { RecordSet } from 'Types/collection';

export default class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 1,
                title: 'Item 1',
            },
            {
                id: 2,
                title: 'Item 2',
            },
            {
                id: 3,
                title: 'Item 3',
                readOnly: true,
            },
        ],
    });
}
