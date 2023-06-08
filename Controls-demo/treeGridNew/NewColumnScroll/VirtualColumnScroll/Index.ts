import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/NewColumnScroll/VirtualColumnScroll/VirtualColumnScroll';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Memory } from 'Types/source';
import { ColumnScroll } from 'Controls-demo/treeGridNew/DemoHelpers/Data/ColumnScroll';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/NewColumnScroll/VirtualColumnScroll/ScrollableColumnTemplate';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[];
    protected _columns: IColumn[];
    protected _stickyColumnsCount: number = 1;
    protected _virtualColumnScrollConfig: object;

    protected _beforeMount(): void {
        const helper = ColumnScroll.create({
            stickyColumnsCount: this._stickyColumnsCount,
            itemsCount: 20,
            columnsCount: 100,
            stickyColumnsWidth: ['250px'],
            columnTemplate: {
                scrollable: ColumnTemplate,
            },
        });

        this._header = helper.getHeader();
        this._columns = helper.getColumns();
        this._virtualColumnScrollConfig = {
            pageSize: 20,
        };

        this._viewSource = new Memory({
            keyProperty: 'key',
            data: helper.getData(),
        });
    }
}
