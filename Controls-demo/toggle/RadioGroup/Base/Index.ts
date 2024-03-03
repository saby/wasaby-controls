import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import Template = require('wml!Controls-demo/toggle/RadioGroup/Base/Template');

export default class Base extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _items1: RecordSet;
    protected _items2: RecordSet;

    protected _beforeMount(): void {
        this._items1 = new RecordSet({
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
        this._items2 = new RecordSet({
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
                    readOnly: true,
                },
            ],
        });
    }
}
