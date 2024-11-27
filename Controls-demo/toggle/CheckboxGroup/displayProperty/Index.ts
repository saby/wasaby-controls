import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/CheckboxGroup/displayProperty/Template');
import { RecordSet } from 'Types/collection';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys1: number[] = [1];
    protected _selectedKeys2: number[] = [1];
    protected _items: RecordSet = new RecordSet({
        keyProperty: 'id',
        rawData: [
            {
                id: 1,
                title: 'title Item 1',
                caption: 'caption Item 1',
            },
            {
                id: 2,
                title: 'title Item 2',
                caption: 'caption Item 2',
            },
            {
                id: 3,
                title: 'title Item 3',
                caption: 'caption Item 3',
            },
        ],
    });
}
export default ViewModes;
