import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/RadioGroup/ItemTemplate/ItemTemplate');
import { RecordSet } from 'Types/collection';

class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey: string = '3';
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'State1',
                    caption: 'Additional caption1',
                    readOnly: true,
                },
                {
                    id: '2',
                    title: 'State2',
                    caption: 'Additional caption2',
                    readOnly: true,
                },
                {
                    id: '3',
                    title: 'State3',
                    caption: 'Additional caption3',
                },
            ],
        });
    }
}
export default ItemTemplate;
