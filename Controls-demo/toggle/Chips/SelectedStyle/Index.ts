import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/SelectedStyle/Template';
import { RecordSet } from 'Types/collection';

export default class SelectedStyle extends Control {
    protected _template: TemplateFunction = Template;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['1'];
    protected _selectedKeys3: string[] = ['1'];
    protected _selectedKeys4: string[] = ['1'];
    protected _selectedKeys5: string[] = ['1'];
    protected _selectedKeys6: string[] = ['1'];
    protected _selectedKeys7: string[] = ['1'];
    protected _selectedKeys8: string[] = ['1'];
    protected _items: RecordSet = new RecordSet({
        rawData: [
            {
                id: '1',
                caption: 'firstChips',
            },
            {
                id: '2',
                caption: 'secondChips',
            },
            {
                id: '3',
                caption: 'thirdChips',
            },
            {
                id: '4',
                caption: 'fourthChips',
            },
        ],
        keyProperty: 'id',
    });
}
