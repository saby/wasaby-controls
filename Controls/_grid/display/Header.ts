/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { create } from 'Types/di';
import { mixin } from 'Types/util';

import { TColumns, TColumnSeparatorSize } from './interface/IColumn';

import Collection from './Collection';
import HeaderRow, { IOptions as IHeaderRowOptions } from './HeaderRow';
import { ISortItem, TColumnScrollViewMode } from './mixins/Grid';
import { VersionableMixin } from 'Types/entity';
import { InitStateByOptionsMixin } from 'Controls/display';

export interface IHeaderBounds {
    row: { start: number; end: number };
    column: { start: number; end: number };
}

/**
 * Заголовок таблицы
 * @private
 */
export default class Header extends mixin<InitStateByOptionsMixin, VersionableMixin>(
    InitStateByOptionsMixin,
    VersionableMixin
) {
    protected _$owner: Collection;
    protected _$rows: HeaderRow[];
    protected _$headerBounds: IHeaderBounds;
    protected _$theme: string;
    protected _$style: string;

    constructor(options: IHeaderRowOptions) {
        super(options);
        this._$rows = this._initializeRows(options);
    }

    getBounds(): IHeaderBounds {
        return this._$headerBounds;
    }

    getRow(): HeaderRow {
        return this._$rows[0];
    }

    getTheme(): string {
        return this._$theme;
    }

    getStyle(): string {
        return this._$style;
    }

    getRowIndex(row: HeaderRow): number {
        return this._$rows.indexOf(row);
    }

    isMultiline(): boolean {
        return this._$headerBounds.row.end - this._$headerBounds.row.start > 1;
    }

    isSticked(): boolean {
        return this._$owner.isStickyHeader() && this._$owner.isFullGridSupport();
    }

    setColumnSeparatorSize(columnSeparatorSize: TColumnSeparatorSize): void {
        this._callRowsMethod('setColumnSeparatorSize', [columnSeparatorSize]);
    }

    setColumnScroll(columnScroll: boolean): void {
        this._callRowsMethod('setColumnScroll', [columnScroll]);
    }

    setStickyColumnsCount(stickyColumnsCount: number): void {
        this._callRowsMethod('setStickyColumnsCount', [stickyColumnsCount]);
    }

    setRowsCount(start: number, stop: number): void {
        this._callRowsMethod('setRowsCount', [start, stop]);
    }

    setColumnsWidths(columnsWidths: string[]) {
        this._callRowsMethod('setColumnsWidths', [columnsWidths]);
    }

    setColumnScrollViewMode(newColumnScrollViewMode: TColumnScrollViewMode): void {
        this._callRowsMethod('setColumnScrollViewMode', [newColumnScrollViewMode]);
    }

    setMultiSelectVisibility(multiSelectVisibility: string): void {
        this._callRowsMethod('setMultiSelectVisibility', [multiSelectVisibility]);
    }

    setColumnsConfig(newColumns: TColumns): void {
        this._callRowsMethod('setColumnsConfig', [newColumns]);
    }

    setGridColumnsConfig(newColumns: TColumns): void {
        this._callRowsMethod('setGridColumnsConfig', [newColumns]);
    }

    setSorting(sorting: ISortItem[]): void {
        this._callRowsMethod('setSorting', [sorting]);
    }

    protected _initializeRows(options: IHeaderRowOptions): HeaderRow[] {
        this._$headerBounds = this._getGridHeaderBounds(options);
        return this._buildRows(options);
    }

    protected _buildRows(options: IHeaderRowOptions): HeaderRow[] {
        const factory = this._getRowsFactory();
        return [new factory(options)];
    }

    protected _getGridHeaderBounds(options: IHeaderRowOptions): IHeaderBounds {
        const bounds: IHeaderBounds = {
            row: { start: Number.MAX_VALUE, end: Number.MIN_VALUE },
            column: { start: 1, end: options.gridColumnsConfig.length + 1 },
        };

        for (let i = 0; i < options.columnsConfig.length; i++) {
            if (typeof options.columnsConfig[i].startRow === 'number') {
                bounds.row.start = Math.min(options.columnsConfig[i].startRow, bounds.row.start);
            } else {
                // Одноуровневая шапка либо невалидная конфигурация шапки
                bounds.row.start = 1;
                bounds.row.end = 2;
                break;
            }

            if (typeof options.columnsConfig[i].endRow === 'number') {
                bounds.row.end = Math.max(options.columnsConfig[i].endRow, bounds.row.end);
            } else {
                // Одноуровневая шапка либо невалидная конфигурация шапки
                bounds.row.start = 1;
                bounds.row.end = 2;
                break;
            }
        }
        return bounds;
    }

    protected _getRowsFactory(): new (options: IHeaderRowOptions) => HeaderRow {
        const self = this;

        return function (options: IHeaderRowOptions) {
            options.headerModel = self;
            options.hasMoreDataUp = !!options.hasMoreData?.up;
            options.theme = self.getTheme();
            options.style = self.getStyle();
            return create(self._rowModule, options as IHeaderRowOptions);
        };
    }

    private _callRowsMethod<T extends keyof HeaderRow>(
        methodName: T,
        args?: Parameters<HeaderRow[T]>
    ): void {
        this._$rows.forEach((row) => {
            return row[methodName](...(args || []));
        });
    }
}

export { IHeaderRowOptions as IOptions };

Object.assign(Header.prototype, {
    '[Controls/_display/grid/Header]': true,
    _moduleName: 'Controls/grid:GridHeader',
    _instancePrefix: 'grid-header-',
    _rowModule: 'Controls/grid:GridHeaderRow',
    _cellModule: 'Controls/grid:GridHeaderCell',
    _$owner: null,
    _$style: 'default',
    _$theme: 'default',
});
