import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/LongHeader/LongHeader';
import { Memory } from 'Types/source';
import { IHeaderCell } from 'Controls/grid';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const MAXITEM = 10;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Countries.getLongHeader(undefined);
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths();

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(0, MAXITEM),
        });
    }
}
