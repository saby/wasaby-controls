import { Control, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory, Memory } from 'Types/source';
import { Master } from '../DataHelpers/Master';
import { IColumn } from 'Controls/grid';
import { TRoot } from 'Controls-demo/types';
import { IHeaderCell } from 'Controls/grid';

import * as DemoSource from 'Controls-demo/MasterDetail/DemoSource';

import * as Template from 'wml!Controls-demo/MasterDetail/Grouped/Grouped';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _masterSource: HierarchicalMemory;
    protected _detailSource: Memory = null;
    protected _columns: IColumn[] = Master.getColumns();
    protected _root: TRoot = null;
    protected _header: IHeaderCell[] = Master.getHeader();

    protected _beforeMount(): void {
        this._masterSource = new HierarchicalMemory({
            parentProperty: 'Раздел',
            keyProperty: 'id',
            data: Master.getData(),
        });
        this._detailSource = new DemoSource({ keyProperty: 'id' });
    }
    static _styles: string[] = ['Controls-demo/MasterDetail/Demo'];
}
