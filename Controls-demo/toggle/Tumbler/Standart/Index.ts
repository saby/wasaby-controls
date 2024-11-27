import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Standart/Template';
import { RecordSet } from 'Types/collection';

export default class Base extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '1';
    protected _selectedKey3: string = '1';

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    title: 'Все',
                },
                {
                    id: '2',
                    title: 'Связано',
                },
                {
                    id: '3',
                    title: 'Не связано',
                },
            ],
            keyProperty: 'id',
        });
    }
}
