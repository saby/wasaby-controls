import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import Template = require('wml!Controls-demo/toggle/RadioGroup/displayProperty/Template');

export default class DisplayProperty extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '1';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Item title 1',
                    caption: 'Item caption 1',
                },
                {
                    id: '2',
                    title: 'Item title 2',
                    caption: 'Item caption 2',
                },
                {
                    id: '3',
                    title: 'Item title 3',
                    caption: 'Item caption 3',
                },
            ],
        });
    }
}
