import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import Template = require('wml!Controls-demo/toggle/RadioGroup/Direction/Template');

class Direction extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _selectedKey: string = '1';
    protected _selectedKey2: string = '1';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                },
                {
                    id: '2',
                    title: 'Item 2',
                },
                {
                    id: '3',
                    title: 'Item 3',
                },
            ],
        });
    }
}

export default Direction;
