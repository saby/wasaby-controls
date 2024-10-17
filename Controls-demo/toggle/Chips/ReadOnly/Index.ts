import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/ReadOnly/Template';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _itemsReadOnly: RecordSet;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['2'];
    protected _selectedKeys3: string[] = ['3'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1',
                },
                {
                    id: '2',
                    caption: 'Название 2',
                },
                {
                    id: '3',
                    caption: 'Название 3',
                },
                {
                    id: '4',
                    caption: '4',
                },
                {
                    id: '5',
                    caption: 'Название 5',
                },
            ],
            keyProperty: 'id',
        });
        this._itemsReadOnly = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1',
                },
                {
                    id: '2',
                    caption: 'Название 2',
                    readOnly: true,
                },
                {
                    id: '3',
                    caption: 'Название 3',
                },
                {
                    id: '4',
                    caption: '4',
                    readOnly: true,
                },
                {
                    id: '5',
                    caption: 'Название 5',
                },
            ],
            keyProperty: 'id',
        });
    }
}
