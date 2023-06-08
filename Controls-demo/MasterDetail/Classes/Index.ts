import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/MasterDetail/Classes/Index');
import { master } from 'Controls-demo/MasterDetail/Data';
import * as cClone from 'Core/core-clone';
import { IHeaderCell } from 'Controls/grid';
import { Memory } from 'Types/source';
import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _markedKey: number = 0;
    protected _detailSource: Memory = null;
    protected _masterSource: Memory = null;
    protected _gridColumns: object[] = [
        {
            displayProperty: 'name',
            width: '1fr',
        },
    ];
    protected _header: IHeaderCell[] = [
        {
            caption: 'Имя',
        },
    ];

    protected _beforeMount(): void {
        this._detailSource = new DemoSource({ keyProperty: 'id' });
        this._masterSource = new Memory({
            keyProperty: 'id',
            data: cClone(master),
        });
    }

    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];
}
