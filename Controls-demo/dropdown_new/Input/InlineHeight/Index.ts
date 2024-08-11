import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Input/InlineHeight/Index');
import { RecordSet } from 'Types/collection';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;
    protected _selectedKeys: number[] = [1];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, title: 'Name' },
                { key: 2, title: 'Date of change' },
            ],
        });
    }
}
