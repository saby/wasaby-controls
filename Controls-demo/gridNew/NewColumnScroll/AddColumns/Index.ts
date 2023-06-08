import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/NewColumnScroll/AddColumns/AddColumns';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = Countries.getHeader();
    private _newColumnWidth: string = '100px';
    private _collIndex: number = 0;
    private _tableWidthTemp: string = '600px';
    protected _tableWidth: string = '600px';
    private _fakeIndex: number = 0;

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
    }

    protected addColumn = (): void => {
        const title = 'new column' + this._collIndex;
        const column = {
            displayProperty: title,
            width: this._newColumnWidth,
            compatibleWidth: this._newColumnWidth,
        };
        this._columns = [...this._columns, column];
        this._header = [...this._header, { title }];
        this._collIndex++;
        this._forceUpdate();
    };

    protected changeWidth = (): void => {
        this._tableWidth = this._tableWidthTemp;
        const columns = this._columns.map((cur) => {
            return { ...cur, fakeIndex: this._fakeIndex };
        });
        this._columns = [...columns];
        this._fakeIndex++;
        this._forceUpdate();
    };
}
