import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/ItemTemplateProperty/Template');
import template = require('wml!Controls-demo/toggle/CheckboxGroup/ItemTemplateProperty/customTemplate');
import { RecordSet } from 'Types/collection';

export default class ItemTemplateProperty extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: number[] = [1];
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 1,
                title: 'Item 1',
                customTemplate: template,
            },
            {
                id: 2,
                title: 'Item 2',
                customTemplate: template,
            },
            {
                id: 3,
                title: 'Item 3',
                customTemplate: template,
            },
        ],
    });
}
