import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/Base/Base';
import { DEFAULT_ROWS_COUNT, DEFAULT_COLUMNS_COUNT } from './../content/Grid/Index';

export default class Index extends Control {
    protected _template: TemplateFunction = Template;
    protected _beforeLength: number = 0;
    protected _afterLength: number = 0;
    protected _marginValue?: string = null;
    protected _stickyHeader: boolean = false;
    protected _width: string = '800px';
    protected _height: string = '600px';

    protected _rowsCountInputValue: number = DEFAULT_ROWS_COUNT;
    protected _rowsCount: number;

    protected _columnsCountInputValue: number = DEFAULT_COLUMNS_COUNT;
    protected _columnsCount: number;

    protected _applyRowsCount(): void {
        this._rowsCount = this._rowsCountInputValue || DEFAULT_ROWS_COUNT;
    }

    protected _applyColumnsCount(): void {
        this._columnsCount = this._columnsCountInputValue || DEFAULT_COLUMNS_COUNT;
    }
}
