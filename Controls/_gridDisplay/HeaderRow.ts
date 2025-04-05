/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IColumn, IColumnSeparatorSizeConfig, TColumnSeparatorSize } from './interface/IColumn';

import { IHeaderCell } from './interface/IHeaderCell';

import Row, { IOptions as IRowOptions } from './Row';
import Header, { IHeaderBounds } from './Header';
import ItemActionsCell from './ItemActionsCell';
import Cell from './Cell';
import HeaderCell from './HeaderCell';
import { ISortItem } from './mixins/Grid';

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
    protected _$columnItems: HeaderCell[];
    protected _$subPixelArtifactFix: boolean;

    readonly listElementName: string = 'header';

    constructor(options?: IOptions) {
        super(options);

        // Заголовок будет всегда застикан при отрисовке, когда есть данные вверх
        this._shadowVisibility = this.hasMoreDataUp() ? 'initial' : 'visible';

        this._$subPixelArtifactFix = options?.subPixelArtifactFix;
    }

    get subPixelArtifactFix(): boolean {
        return this._$subPixelArtifactFix;
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

    getHeaderModel(): Header {
        return this._$headerModel;
    }

    getColumnItems(): HeaderCell[] {
        return this._$columnItems;
    }

    protected _processStickyLadderCells(): void {
        // todo Множественный stickyProperties можно поддержать здесь:
        const column = this._$gridColumnsConfig[0];
        const stickyLadderProperties = this.getStickyLadderProperties(column);
        const stickyLadderCellsCount =
            (stickyLadderProperties && stickyLadderProperties.length) || 0;
        const getHeaderCell = (ladderCellIndex: 0 | 1) => {
            let columnConfig;

            if (!this.isMultiline()) {
                columnConfig = {
                    key: `header-ladder-${ladderCellIndex}`,
                };
            } else {
                // Первая ячейка шапки это первая ячейка в таблице, а вторая ячейка лесенки - третья ячейка таблицы.
                columnConfig = {
                    startColumn: 1 + (ladderCellIndex ? 2 : 0),
                    endColumn: 2 + (ladderCellIndex ? 2 : 0),
                    startRow: this._$headerModel.getBounds().row.start,
                    endRow: this._$headerModel.getBounds().row.end,
                    key: `header-ladder-${ladderCellIndex}`,
                };
            }

            return new HeaderCell({
                column: columnConfig,
                isLadderCell: true,
                owner: this,
                backgroundStyle: 'transparent',
                shadowVisibility: 'hidden',
            });
        };

        // Если ячейка заголовка заколспанена, то не нужно добавлять вторую пустую ячейку
        // она тоже должна уйти в колспан
        const headerColumn = this._$columnsConfig[0];
        if (
            stickyLadderCellsCount === 2 &&
            (!headerColumn.endColumn || headerColumn.endColumn <= 2)
        ) {
            this._$columnItems.splice(1, 0, getHeaderCell(1) as unknown as Cell);
        }

        if (stickyLadderCellsCount) {
            this._$columnItems = ([getHeaderCell(0)] as unknown as Cell[]).concat(
                this._$columnItems
            );
        }
    }

    getBounds(): IHeaderBounds {
        return this._$headerModel.getBounds();
    }

    setColumnsWidths(columnsWidths) {
        this._$columnsWidths = columnsWidths;
        this._nextVersion();
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
                    rightSeparatorSize: this._getRightSeparatorSizeForColumn(column, index),
                    shadowVisibility: this.getShadowVisibility(),
                };
            };

            this._$columnItems = this._$columnsConfig.map((column, index) => {
                const isFixed =
                    (this.isMultiline() ? column.startColumn - 1 : totalColspan) <
                    this.getStickyColumnsCount();
                const isFixedToEnd = this.hasColumnScroll()
                    ? this.getOwner().getColumnsCount() -
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
                        fixedZIndex: cellProps.multiSelectFixedZIndex,
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

    protected _updateSeparatorSizeInColumns(separatorName: 'Left' | 'Right' | 'Row'): void {
        const multiSelectOffset = this.hasMultiSelectColumn() ? 1 : 0;
        this._$columnsConfig.forEach((column, columnIndex) => {
            const cell = this._$columnItems[columnIndex + multiSelectOffset];
            cell[`set${separatorName}SeparatorSize`](
                this[`_get${separatorName}SeparatorSizeForColumn`](column, columnIndex)
            );
        });
    }

    protected _getNextHeaderColumnIndex(column: IHeaderCell, columnIndex: number): number {
        if (column.endColumn === undefined) {
            return columnIndex + 1;
        } else {
            return this._$columnsConfig.findIndex((col) => col.startColumn === column.endColumn);
        }
    }

    protected _getRightSeparatorSizeForColumn(
        column: IHeaderCell,
        columnIndex: number
    ): TColumnSeparatorSize {
        if (columnIndex < this._$columnsConfig.length - 1) {
            const currentColumn = this._getHeaderColumnWithSeparator(column, columnIndex);

            const nextColumnIndex = this._getNextHeaderColumnIndex(column, columnIndex);
            if (nextColumnIndex !== -1) {
                const nextColumnConfig = this._$columnsConfig[nextColumnIndex];
                const nextColumn = this._getHeaderColumnWithSeparator(
                    nextColumnConfig,
                    nextColumnIndex
                );
                return this._resolveColumnSeparatorSize(nextColumn, currentColumn);
            }
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
                if ((cell as ItemActionsCell).SupportItemActions || !cell.$GHC) {
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
