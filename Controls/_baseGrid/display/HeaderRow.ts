/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import {
    ICellPadding,
    IColumn,
    IColumnSeparatorSizeConfig,
    TColumnSeparatorSize,
} from './interface/IColumn';

import { IHeaderCell } from './interface/IHeaderCell';

import Row, { IOptions as IRowOptions } from './Row';
import Header, { IHeaderBounds } from './Header';
import ItemActionsCell from './ItemActionsCell';
import Cell from './Cell';
import HeaderCell from './HeaderCell';
import { ISortItem } from './mixins/Grid';
import ColumnResizerCell from './ColumnResizerCell';

export interface IOptions extends IRowOptions<null> {
    headerModel: Header;
    columnsWidths: string[];
}

/**
 * Строка заголовка в таблице
 * @private
 */
export default class HeaderRow extends Row<null> {
    protected _$headerModel: Header;
    protected _$sorting: ISortItem[];
    protected _$columnsWidths: string[] = [];
    protected _$resizerOffsetCallback: Function;
    protected _resizerCell: Cell<any, Row<any>>;
    protected _resizingGridColumnIndex: number;

    readonly listElementName: string = 'header';

    constructor(options?: IOptions) {
        super(options);

        // Заголовок будет всегда застикан при отрисовке, когда есть данные вверх
        this._shadowVisibility = this.hasMoreDataUp() ? 'initial' : 'visible';
    }

    getIndex(): number {
        return this._$owner.getRowIndex(this);
    }

    isSticked(): boolean {
        return this._$headerModel.isSticked();
    }

    isMultiline(): boolean {
        return this._$headerModel.isMultiline();
    }

    getContents(): string {
        return 'header';
    }

    getItemClasses(): string {
        return 'controls-Grid__header';
    }

    getColumnIndex(cell: HeaderCell, takeIntoAccountColspans: boolean = false): number {
        const superIndex = super.getColumnIndex.apply(this, arguments);
        const columnItems = this.getColumns() as HeaderCell[];
        let ladderCells = 0;

        // Ищем индекс ячейки, попутно считаем колспаны предыдущих.
        columnItems.forEach((columnItem, index) => {
            if (columnItem.isLadderCell() && index < superIndex) {
                ladderCells++;
            }
        });

        return superIndex - ladderCells;
    }

    protected _processStickyLadderCells(): void {
        // todo Множественный stickyProperties можно поддержать здесь:
        const stickyLadderProperties = this.getStickyLadderProperties(this._$gridColumnsConfig[0]);
        const stickyLadderCellsCount =
            (stickyLadderProperties && stickyLadderProperties.length) || 0;
        const getColumnConfig = (ladderCellIndex: 0 | 1) => {
            if (!this.isMultiline()) {
                return {};
            }
            // Первая ячейка шапки это первая ячейка в таблице, а вторая ячейка лесенки - третья ячейка таблицы.
            return {
                startColumn: 1 + (ladderCellIndex ? 2 : 0),
                endColumn: 2 + (ladderCellIndex ? 2 : 0),
                startRow: this._$headerModel.getBounds().row.start,
                endRow: this._$headerModel.getBounds().row.end,
            };
        };

        if (stickyLadderCellsCount === 2) {
            this._$columnItems.splice(
                1,
                0,
                new HeaderCell({
                    column: getColumnConfig(1),
                    isLadderCell: true,
                    owner: this,
                    backgroundStyle: 'transparent',
                    shadowVisibility: 'hidden',
                })
            );
        }

        if (stickyLadderCellsCount) {
            this._$columnItems = (
                [
                    new HeaderCell({
                        column: getColumnConfig(0),
                        isLadderCell: true,
                        owner: this,
                        shadowVisibility: 'hidden',
                        backgroundStyle: 'transparent',
                    }),
                ] as Cell[]
            ).concat(this._$columnItems);
        }
    }

    hasBreadCrumbsCell(): boolean {
        return this._$columnsConfig[0]?.isBreadCrumbs;
    }

    getBounds(): IHeaderBounds {
        return this._$headerModel.getBounds();
    }

    setRowsCount(start: number, stop: number): void {
        if (this._resizerCell) {
            const headerRowsCount = this.getBounds().row.end - this.getBounds().row.start;
            const dataRowsCount = stop - start;
            if (this._resizerCell.setRowspan(headerRowsCount + dataRowsCount)) {
                this._nextVersion();
            }
        }
    }

    setColumnsWidths(columnsWidths) {
        this._$columnsWidths = columnsWidths;
        this._nextVersion();
        this._resizerCell?.setWidth(parseInt(columnsWidths[this._resizingGridColumnIndex], 10));
    }

    calcResizerRowspan(rowsCount: number): number {
        const hasColumnScroll = !!this.getOwner().hasColumnScroll();
        return rowsCount + +hasColumnScroll + +this.isSticked();
    }

    protected _initializeColumns(): void {
        if (this._$columnsConfig) {
            this._$columnItems = [];
            const factory = this.getColumnsFactory();
            let totalColspan = 0;

            const getColumnParams = (column: IHeaderCell, index: number) => {
                return {
                    sorting: this._getSortingBySortingProperty(column.sortingProperty),
                    backgroundStyle: this._$backgroundStyle,
                    cellPadding: this._getCellPaddingForHeaderColumn(column, index),
                    leftSeparatorSize: this._getLeftSeparatorSizeForColumn(column, index),
                    rightSeparatorSize: this._getRightSeparatorSizeForColumn(column, index),
                    shadowVisibility: this.getShadowVisibility(),
                };
            };

            this._$columnItems = this._$columnsConfig.map((column, index) => {
                const isFixed =
                    (this.isMultiline() ? column.startColumn - 1 : totalColspan) <
                    this.getStickyColumnsCount();
                const isFixedToEnd = this.hasColumnScrollReact()
                    ? this._$columnsConfig.length -
                          (this.isMultiline() ? column.startColumn - 1 : totalColspan) <=
                      this.getEndStickyColumnsCount()
                    : false;
                totalColspan += column.endColumn - column.startColumn || 1;
                return factory({
                    column,
                    isFixed,
                    isFixedToEnd,
                    ...getColumnParams(column, index),
                });
            });

            if (this.getOwner().hasSpacingColumn()) {
                const column = {};
                const index = this._$columnItems.length - 1;
                const lastColumn = this._$columnItems[index];
                this._$columnItems.push(
                    factory({
                        column,
                        isFixed: false,
                        isSpacingCell: true,
                        rowspan: this.getBounds().row.end - this.getBounds().row.start,
                        ...getColumnParams(column, index),
                        leftSeparatorSize: this._resolveColumnSeparatorSizeForSpacingColumn(
                            lastColumn.config
                        ),
                        rightSeparatorSize: null,
                    })
                );
            }

            this._processStickyLadderCells();
            this._addCheckBoxColumnIfNeed();

            if (this.getOwner().hasResizer()) {
                const getColumnWidth = (cfg) => {
                    if (this.hasColumnScrollReact()) {
                        const widths = this.getOwner().getColumnWidths();
                        if (widths && widths.length) {
                            const checkboxOffset = +this._hasCheckBoxCell();
                            const width = parseInt(
                                widths[this._resizingGridColumnIndex + checkboxOffset],
                                10
                            );

                            if (typeof width === 'number' && !Number.isNaN(width)) {
                                return width;
                            }
                        }
                    }

                    return parseInt(
                        this._$columnsWidths[this._resizingGridColumnIndex] || cfg.width,
                        10
                    );
                };

                const column = {};
                const resizerCellIndex = this.getStickyColumnsCount() + +this._hasCheckBoxCell();
                this._resizingGridColumnIndex = this.getStickyColumnsCount() - 1;
                const resizingColumnConfig =
                    this._$gridColumnsConfig[this._resizingGridColumnIndex];
                this._$columnItems.splice(
                    resizerCellIndex,
                    0,
                    new ColumnResizerCell({
                        owner: this,
                        column,
                        rowspan: this.calcResizerRowspan(
                            this.getBounds().row.end -
                                this.getBounds().row.start +
                                this.getOwner().getItems().length
                        ),
                        minWidth: parseInt(resizingColumnConfig.minWidth, 10),
                        maxWidth: parseInt(resizingColumnConfig.maxWidth, 10),
                        width: getColumnWidth(resizingColumnConfig),
                        isFixed: true,
                        isResizerCell: true,
                        cellPadding: {
                            left: null,
                            right: null,
                        },
                        resizerOffsetCallback: this._$resizerOffsetCallback,
                    })
                );
                this._resizerCell = this._$columnItems[resizerCellIndex];
            }

            if (this.hasItemActionsSeparatedCell()) {
                this._$columnItems.push(
                    new ItemActionsCell({
                        owner: this,
                        rowspan: this.getBounds().row.end - this.getBounds().row.start,
                        column: {},
                    })
                );
            }
        }
    }

    protected _addCheckBoxColumnIfNeed(): void {
        const factory = this.getColumnsFactory();
        if (this.hasMultiSelectColumn()) {
            const { start, end } = this._$headerModel.getBounds().row;

            const columnConfig = {
                startRow: start,
                endRow: end,
                startColumn: 1,
                endColumn: 2,
            };
            if (this._$columnsConfig?.[0]?.getCellProps) {
                // Наследуем в колонке под чекбокс фон цвета из первой колонки,
                // чтобы не было пустого места с просвечивающим фоном.
                columnConfig.getCellProps = () => {
                    const cellProps = this._$columnsConfig[0].getCellProps();
                    return {
                        backgroundStyle: cellProps.backgroundStyle,
                        className: cellProps.multiSelectClassName,
                    };
                };
            }

            this._$columnItems.unshift(
                factory({
                    column: columnConfig,
                    backgroundStyle: this._$backgroundStyle,
                    isFixed: true,
                    isCheckBoxCell: true,
                    shadowVisibility: this.getShadowVisibility(),
                })
            );
        }
    }

    protected _getCellPaddingForHeaderColumn(
        headerColumn: IHeaderCell,
        columnIndex: number
    ): ICellPadding {
        const columns = this.getGridColumnsConfig();
        const headerColumnIndex =
            typeof headerColumn.startColumn !== 'undefined'
                ? headerColumn.startColumn - 1
                : columnIndex;
        return columns[headerColumnIndex].cellPadding;
    }

    protected _updateSeparatorSizeInColumns(separatorName: 'Left' | 'Right' | 'Row'): void {
        const multiSelectOffset = this.hasMultiSelectColumn() ? 1 : 0;
        this._$columnsConfig.forEach((column, columnIndex) => {
            const cell = this._$columnItems[columnIndex + multiSelectOffset];
            cell[`set${separatorName}SeparatorSize`](
                this[`_get${separatorName}SeparatorSizeForColumn`](column, columnIndex)
            );
        });
    }

    protected _getLeftSeparatorSizeForColumn(
        column: IHeaderCell,
        columnIndex: number
    ): TColumnSeparatorSize {
        if (columnIndex > 0) {
            const currentColumn = this._getHeaderColumnWithSeparator(column, columnIndex);

            const prevColumnIndex =
                columnIndex -
                (columnIndex > 1 &&
                this._$columnsConfig[columnIndex - 1].startColumn === column.startColumn &&
                column.startColumn !== undefined
                    ? 2
                    : 1);

            const prevColumnConfig = this._$columnsConfig[prevColumnIndex];
            const previousColumn = this._getHeaderColumnWithSeparator(
                prevColumnConfig,
                prevColumnIndex
            );
            return this._resolveColumnSeparatorSize(currentColumn, previousColumn);
        }
        return null;
    }

    protected _getRightSeparatorSizeForColumn(
        column: IHeaderCell,
        columnIndex: number
    ): TColumnSeparatorSize {
        if (columnIndex < this._$columnsConfig.length - 1) {
            const currentColumn = this._getHeaderColumnWithSeparator(column, columnIndex);

            const nextColumnIndex =
                columnIndex +
                (columnIndex < this._$columnsConfig.length - 2 &&
                this._$columnsConfig[columnIndex + 1].endColumn === column.endColumn &&
                column.endColumn !== undefined
                    ? 2
                    : 1);

            const nextColumnConfig = this._$columnsConfig[nextColumnIndex];
            const nextColumn = this._getHeaderColumnWithSeparator(
                nextColumnConfig,
                nextColumnIndex
            );
            return this._resolveColumnSeparatorSize(nextColumn, currentColumn);
        }
        return null;
    }

    private _getHeaderColumnWithSeparator(
        headerColumn: IHeaderCell,
        columnIndex: number
    ): IHeaderCell {
        const columnSeparatorSize: IColumnSeparatorSizeConfig = {};
        const columns = this.getGridColumnsConfig();
        const columnLeftIndex =
            typeof headerColumn.startColumn !== 'undefined'
                ? headerColumn.startColumn - 1
                : columnIndex;
        const columnRightIndex =
            typeof headerColumn.endColumn !== 'undefined'
                ? headerColumn.endColumn - 2
                : columnIndex;
        const columnLeft = columns[columnLeftIndex];
        const columnRight = columns[columnRightIndex];
        if (columnLeft?.columnSeparatorSize?.hasOwnProperty('left')) {
            columnSeparatorSize.left = columnLeft.columnSeparatorSize.left;
        }
        if (columnRight?.columnSeparatorSize?.hasOwnProperty('right')) {
            columnSeparatorSize.right = columnRight.columnSeparatorSize.right;
        }

        return {
            ...headerColumn,
            columnSeparatorSize,
        } as IColumn;
    }

    setSorting(sorting: ISortItem[]): void {
        this._$sorting = sorting;
        if (this._$columnItems) {
            this._$columnItems.forEach((cell) => {
                // Пропускаем колонку для операций над записью
                // либо если ячейка не является ячейкой заголовка (если задан resizer, может прийти ячейка ресайзера)
                if (
                    (cell as ItemActionsCell).SupportItemActions ||
                    !cell['[Controls/_display/grid/HeaderCell]']
                ) {
                    return;
                }
                const cellSorting = this._getSortingBySortingProperty(
                    (cell as HeaderCell).getSortingProperty()
                );
                (cell as HeaderCell).setSorting(cellSorting);
            });
            this._nextVersion();
        }
    }

    private _getSortingBySortingProperty(property: string): string {
        const sorting = this._$sorting;
        let sortingDirection;
        if (sorting && property) {
            sorting.forEach((elem) => {
                if (elem[property]) {
                    sortingDirection = elem[property];
                }
            });
        }
        return sortingDirection;
    }
}

Object.assign(HeaderRow.prototype, {
    '[Controls/_display/grid/HeaderRow]': true,
    _moduleName: 'Controls/grid:GridHeaderRow',
    _instancePrefix: 'grid-header-row-',
    _cellModule: 'Controls/grid:GridHeaderCell',
    _$headerModel: null,
    _$columnsWidths: null,
    _$resizerOffsetCallback: null,
    _$sorting: null,
});
