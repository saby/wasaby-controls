import {Control, TemplateFunction} from 'UI/Base';
import {RecordSet} from 'Types/collection';
import * as Template from 'wml!Controls-demo/Filter_new/FilterTumblerContainer/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet = null;
    protected _selectedKey: string = '1';
    protected _contextValue: object = {};

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Название 1'
                },
                {
                    id: '2',
                    caption: 'Название 2'
                }
            ],
            keyProperty: 'id'
        });
        this._contextValue = {
            items: this._items
        };
    }
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
