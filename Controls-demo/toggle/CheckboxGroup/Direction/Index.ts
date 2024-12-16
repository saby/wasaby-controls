import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/Direction/Template');
import { RecordSet } from 'Types/collection';

export default class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys1: number[] = [1, 2];
    protected _selectedKeys2: number[] = [2];
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
            },
        ],
    });
}
