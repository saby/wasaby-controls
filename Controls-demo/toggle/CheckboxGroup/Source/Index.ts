import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/Source/Template');
import { Memory } from 'Types/source';

export default class Source extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: number[] = [1];
    protected _source: Memory = new Memory({
        keyProperty: 'id',
        data: [
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
