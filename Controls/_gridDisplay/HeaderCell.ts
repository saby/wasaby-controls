/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IColspanParams } from './interface/IColumn';
import { IHeaderCell } from './interface/IHeaderCell';
import { IItemPadding } from 'Controls/display';
import HeaderRow from './HeaderRow';
import Cell, { IOptions as ICellOptions } from './Cell';
import { TSortingValue } from 'Controls/interface';

export interface IOptions extends ICellOptions<null> {
    shadowVisibility?: string;
    sorting?: string;
    cellPadding?: IItemPadding;
}

/**
 * Ячейка строки заголовка в таблице
 * @private
 */
export default class HeaderCell extends Cell<null, HeaderRow> {
    protected readonly _defaultCellTemplate: string = 'Controls/grid:HeaderContent';
    readonly listInstanceName: string = 'controls-Grid__header';

    protected _$owner: HeaderRow;
    protected _$column: IHeaderCell;
    protected _$sorting: TSortingValue;
    private _$isCheckBoxCell: boolean;
    protected $GHC: boolean;

    get key(): string {
        return `${
            this._$column?.key || this.getDisplayProperty() || 'header-' + this.getColumnIndex()
        }`;
    }

    get CheckBoxCell(): boolean {
        return (
            !this._$isLadderCell &&
            this._$isCheckBoxCell &&
            this._$owner.hasMultiSelectColumn() &&
            this._$owner.getHeaderConfig().indexOf(this._$column) === -1
        );
    }

    isLadderCell(): boolean {
        return this._$isLadderCell;
    }

    // region Аспект "Объединение колонок"
    getColspanParams(): IColspanParams {
        if (this.CheckBoxCell) {
            return {
                startColumn: 1,
                endColumn: 2,
                colspan: 1,
            };
        }
        const isMultilineHeader = this._$owner.isMultiline();

        if (this._$column.startColumn && this._$column.endColumn) {
            const multiSelectOffset = this.CheckBoxCell ? 0 : +this._$owner.hasMultiSelectColumn();
            let stickyLadderCellsCount = 0;
            let startLadderOffset = 0;

            if (!(this._$isLadderCell && isMultilineHeader)) {
                stickyLadderCellsCount = this._$owner.getStickyLadderCellsCount();
                startLadderOffset =
                    this._$column.startColumn > 1
                        ? stickyLadderCellsCount
                        : +!!stickyLadderCellsCount;
            }

            return {
                startColumn: this._$column.startColumn + multiSelectOffset + startLadderOffset,
                endColumn: this._$column.endColumn + multiSelectOffset + stickyLadderCellsCount,
            };
        }
        return super.getColspanParams();
    }

    getColspan(): number {
        // TODO: Перейти на базовый метод
        const params = this.getColspanParams() || {};
        return params.endColumn - params.startColumn || 1;
    }

    // endregion

    // region Аспект "Объединение строк"
    getRowspanParams(): {
        startRow: number;
        endRow: number;
        rowspan: number;
    } {
        const startRow =
            typeof this._$column.startRow === 'number'
                ? this._$column.startRow
                : this._$owner.getIndex() + 1;
        let endRow;

        if (typeof this._$column.endRow === 'number') {
            endRow = this._$column.endRow;
        } else if (typeof this._$column.rowspan === 'number') {
            endRow = startRow + this._$column.rowspan;
        } else {
            endRow = startRow + 1;
        }

        return {
            startRow,
            endRow,
            rowspan: endRow - startRow,
        };
    }

    getRowspan(): number {
        return this.getRowspanParams()?.rowspan || 1;
    }

    // endregion

    getCaption(): string {
        // todo "title" - is deprecated property, use "caption"
        return this._$column.caption || this._$column.title;
    }

    getSortingProperty(): string {
        return this._$column.sortingProperty;
    }

    setSorting(sorting: string): void {
        if (this._$sorting !== sorting) {
            this._$sorting = sorting;
            this._nextVersion();
        }
    }

    getSorting(): TSortingValue | undefined {
        return this._$sorting;
    }

    // todo <<< START >>> compatible with old gridHeaderModel
    get column(): IHeaderCell {
        return this._$column;
    }

    // todo <<< END >>>

    isLastColumn(): boolean {
        const isMultilineHeader = this._$owner.isMultiline();
        if (isMultilineHeader) {
            let headerEndColumn = this._$owner.getBounds().column.end;
            const currentEndColumn = this.getColspanParams().endColumn;
            if (this._$owner.hasMultiSelectColumn()) {
                headerEndColumn += 1;
            }
            return currentEndColumn === headerEndColumn;
        } else {
            return super.isLastColumn();
        }
    }

    protected _getLastColumnIndex(): number {
        let count = 0;

        // Ищем индекс ячейки, попутно считаем колспаны предыдущих.
        this.getOwner()
            .getColumns()
            .forEach((columnItem, index) => {
                if (columnItem.isLadderCell()) {
                    count++;
                }
            });

        return super._getLastColumnIndex() - count;
    }

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'stackable';
    }
}

Object.assign(HeaderCell.prototype, {
    $GHC: true,
    _moduleName: 'Controls/grid:GridHeaderCell',
    _instancePrefix: 'grid-header-cell-',
    _$sorting: '',
    _$isCheckBoxCell: false,
    _$isSpacingCell: false,
    _$isResizerCell: false,
});
