import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Control, TemplateFunction } from 'UI/Base';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import * as template from 'wml!Controls-demo/treeGridNew/ItemsSpacing/Base/Index';
import 'css!DemoStand/Controls-demo';
import { TOffsetSize } from 'Controls/_interface/IOffset';
import { RecordSet } from 'Types/collection';

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    protected _itemsSpacing: TOffsetSize = 'm';

    protected _itemsSpacingSource: RecordSet = new RecordSet({
        rawData: [
            { id: '3xs' },
            { id: '2xs' },
            { id: 'xs' },
            { id: 's' },
            { id: 'st' },
            { id: 'm' },
            { id: 'l' },
            { id: 'xl' },
            { id: '2xl' },
            { id: '3xl' },
        ],
        keyProperty: 'id',
    });

    protected _beforeMount(): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Flat.getData(),
        });
    }
}
