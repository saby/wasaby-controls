import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/ItemTemplate/Template');
import { RecordSet } from 'Types/collection';

export default class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: number[] = [1];
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 1,
                title: 'Item 1',
                text: 'Additional Text',
            },
            {
                id: 2,
                title: 'Item 2',
                text: 'Additional Text',
            },
            {
                id: 3,
                title: 'Item 3',
                text: 'Additional Text',
            },
        ],
    });
}
