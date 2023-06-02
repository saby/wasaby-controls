import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/AddButton/AddButton';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Header/AddButton/FirstHeaderCellTemplate';
import 'wml!Controls-demo/gridNew/Header/AddButton/Cell';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

const MAXITEM = 10;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _gridCaption: string = 'Характеристики стран';
    private _header: IHeaderCell[] = Countries.getHeader().slice(1);
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().slice(1);

    protected _beforeMount(): void {
        this._header.forEach((hColumn) => {
            // eslint-disable-next-line
            hColumn.template =
                'wml!Controls-demo/gridNew/Header/AddButton/Cell';
        });

        this._header[0] = {
            ...this._header[0],
            // eslint-disable-next-line
            template:
                'wml!Controls-demo/gridNew/Header/AddButton/FirstHeaderCellTemplate',
            captionForGrid: this._gridCaption,
        };

        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Countries.getData().slice(0, MAXITEM),
        });
    }
}
