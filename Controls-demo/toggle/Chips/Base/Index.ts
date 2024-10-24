import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/Base/Template';
import { RecordSet } from 'Types/collection';

export default class Base extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Chips 1',
                },
                {
                    id: '2',
                    caption: 'Chips 2',
                },
            ],
            keyProperty: 'id',
        });
    }
}
