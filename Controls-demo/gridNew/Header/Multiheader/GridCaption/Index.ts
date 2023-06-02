import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaption';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaptionHeaderCell';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { MultiHeader } from 'Controls-demo/gridNew/DemoHelpers/Data/MultiHeader';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _header: IHeaderCell[] = MultiHeader.getHeader2();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().slice(1);

    protected _beforeMount(): void {
        // eslint-disable-next-line
        this._header[0].template =
            'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaptionHeaderCell';
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData(),
        });
    }
}
