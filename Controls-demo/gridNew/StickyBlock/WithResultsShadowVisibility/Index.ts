import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as Template from 'wml!Controls-demo/gridNew/StickyBlock/WithResultsShadowVisibility/WithResultsShadowVisibility';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths(false);
    private _dataArray: unknown = Countries.getData();

    protected _beforeMount(): void {
        this._dataArray = this._dataArray.map((it, index) => {
            return { ...it, group: 'Группа ' + Math.round(index / 10) };
        });
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
}
