import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnSeparator/PartialColumnSeparator/VariantTwo/VariantTwo';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import * as clone from 'Core/core-clone';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[];
    protected _columns: IColumn[];

    protected _rowSeparator: boolean = false;
    protected _columnSeparator: boolean = true;

    protected _beforeMount(): void {
        let columnData = clone(Countries.getColumnsWithFixedWidths());
        // eslint-disable-next-line
        columnData = [...columnData.slice(0, 2), ...columnData.slice(3, 6)];
        // eslint-disable-next-line
        columnData[2].align = 'center';
        // eslint-disable-next-line
        columnData[3].align = 'center';
        // eslint-disable-next-line
        columnData[4].align = 'center';

        this._columns = clone(columnData);
        // eslint-disable-next-line
        this._columns[2].columnSeparatorSize = { right: null };

        this._header = [
            {
                startRow: 1,
                endRow: 3,
                startColumn: 1,
                endColumn: 2,
                title: '#',
            },
            {
                startRow: 1,
                endRow: 3,
                startColumn: 2,
                endColumn: 3,
                title: 'Страна',
            },
            {
                startRow: 1,
                endRow: 2,
                startColumn: 3,
                endColumn: 5,
                align: 'center',
                title: 'Характеристики',
            },
            {
                startRow: 2,
                endRow: 3,
                startColumn: 3,
                endColumn: 4,
                align: 'center',
                title: 'Население',
            },
            {
                startRow: 2,
                endRow: 3,
                startColumn: 4,
                endColumn: 5,
                align: 'center',
                title: 'Площадь',
            },
            {
                startRow: 1,
                endRow: 3,
                startColumn: 5,
                endColumn: 6,
                align: 'center',
                title: 'Плотность',
            },
        ];

        this._viewSource = new Memory({
            keyProperty: 'id',
            // eslint-disable-next-line
            data: Countries.getData().splice(0, 5),
        });
    }
}
