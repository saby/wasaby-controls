import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/DisplayPropertyIsNumber/DisplayPropertyIsNumber';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

    protected _columns: IColumn[] = [
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 0,
            width: '1fr',
        },
        {
            displayProperty: 1,
            width: '1fr',
        },
        {
            displayProperty: 2,
            width: '1fr',
        },
        {
            displayProperty: 3,
            width: '1fr',
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [
                {
                    key: 0,
                    country: 'Apple',
                    0: 90146,
                    1: 82959,
                    2: 97278,
                    3: 123945,
                },
                {
                    key: 1,
                    country: 'Xiaomi',
                    0: 77445,
                    1: 81232,
                    2: 92000,
                    3: 123122,
                },
                {
                    key: 2,
                    country: 'Samsung',
                    0: 65123,
                    1: 87232,
                    2: 123142,
                    3: 83521,
                },
            ],
        });
    }
}
