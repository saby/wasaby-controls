/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
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
        return (
            this._$owner.hasMultiSelectColumn() &&
            this._$headerModel.getRowIndex(this) === 0
        );
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
