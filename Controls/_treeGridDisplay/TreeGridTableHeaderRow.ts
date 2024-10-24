/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridHeaderRow from './TreeGridHeaderRow';
import { GridHeaderRow } from 'Controls/gridDisplay';

/**
 * Строка заголовка в иерархической таблице, которая не поддерживает grid.
 * @private
 */
export default class TreeGridTableHeaderRow extends TreeGridHeaderRow {
    getItemClasses(): string {
        return '';
    }

    hasMultiSelectColumn(): boolean {
        return (
            this._$owner.hasMultiSelectColumn() &&
            this._$headerModel.getRowIndex(this as GridHeaderRow<null>) === 0
        );
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

Object.assign(TreeGridTableHeaderRow.prototype, {
    '[Controls/_display/grid/TableHeaderRow]': true,
    '[Controls/treeGrid:TreeGridTableHeaderRow]': true,
});
