import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/content/Grid/Grid';
import { Memory } from 'Types/source';
import { getData } from './resources/data';
import { getColumns } from './resources/columns';
import { getHeader, TActionClickCallbackType } from './resources/header';
import { TColumns, THeader } from 'Controls/grid';

export const DEFAULT_ROWS_COUNT = 50;
export const DEFAULT_COLUMNS_COUNT = 50;

interface IGridOptions extends IControlOptions {
    rowsCount: number;
    columnsCount: number;
}

export default class Grid extends Control<IGridOptions> {
    protected _template: TemplateFunction = Template;
    protected readonly _keyProperty: string = 'key';
    protected readonly _parentProperty: string = 'key';
    protected readonly _nodeProperty: string = 'key';
    protected _viewSource: Memory;
    protected _header: THeader;
    protected _columns: TColumns;

    private _useControls: boolean = false;
    private _rowsCount: number;
    private _columnsCount: number;

    constructor(options: IControlOptions) {
        super(options);
        this._onHeaderAddButtonClickCallback =
            this._onHeaderAddButtonClickCallback.bind(this);
    }

    protected _beforeMount(options: IGridOptions): void {
        this._rowsCount = options.rowsCount || DEFAULT_ROWS_COUNT;
        this._columnsCount = options.columnsCount || DEFAULT_COLUMNS_COUNT;
        this._header = getHeader(
            this._columnsCount,
            this._onHeaderAddButtonClickCallback
        );
        this._columns = getColumns(this._columnsCount);
        this._initSource(this._rowsCount, this._columnsCount);
    }

    protected _beforeUpdate(newOptions: IGridOptions): void {
        const newRowsCount = newOptions.rowsCount || DEFAULT_ROWS_COUNT;
        const newColumnsCount =
            newOptions.columnsCount || DEFAULT_COLUMNS_COUNT;

        if (this._rowsCount !== newRowsCount) {
            this._rowsCount = newRowsCount;
            this._initSource(this._rowsCount, this._columnsCount);
        } else if (this._columnsCount !== newColumnsCount) {
            this._columnsCount = newColumnsCount;
            this._header = getHeader(
                this._columnsCount,
                this._onHeaderAddButtonClickCallback
            );
            this._columns = getColumns(this._columnsCount);
            this._initSource(this._rowsCount, this._columnsCount);
        }
    }

    private _onHeaderAddButtonClickCallback(
        type: TActionClickCallbackType
    ): void {
        switch (type) {
            case 'controls':
                this._useControls = !this._useControls;
                this._columns = getColumns(
                    this._options.columnsCount || DEFAULT_COLUMNS_COUNT,
                    this._useControls
                );
                break;
        }
    }

    private _initSource(rowsCount: number, columnsCount: number): void {
        this._viewSource = new Memory({
            keyProperty: this._keyProperty,
            data: getData(rowsCount, columnsCount),
        });
    }
}
