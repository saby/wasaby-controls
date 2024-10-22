/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import HeaderRow from './HeaderRow';

/**
 * Строка заголовка в таблице, которая не поддерживает css grid
 * @private
 */
export default class TableHeaderRow extends HeaderRow {
    getItemClasses(): string {
        return '';
    }

    hasMultiSelectColumn(): boolean {
        return this._$owner.hasMultiSelectColumn() && this._$headerModel.getRowIndex(this) === 0;
    }

    protected _processStickyLadderCells(): void {
        // Таблицы не поддерживает лесенку в старых браузерах.
    }

    protected _addCheckBoxColumnIfNeed(): void {
        const factory = this.getColumnsFactory();
        if (this.hasMultiSelectColumn()) {
            const { start, end } = this._$headerModel.getBounds().row;
            this._$columnItems.unshift(
                factory({
                    column: {
                        startRow: start,
                        endRow: end,
                    },
                    isFixed: true,
                    isCheckBoxCell: true,
                })
            );
        }
    }
}

Object.assign(TableHeaderRow.prototype, {
    '[Controls/_display/grid/TableHeaderRow]': true,
});
