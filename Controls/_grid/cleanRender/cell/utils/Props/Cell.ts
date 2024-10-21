import { GridCell } from 'Controls/gridDisplay';

/*
 * Определяет первую ячейку после multiSelect
 * @private
 * @param cell
 */
export function isFirstDataCell(cell: GridCell): boolean {
    const row = cell.getOwner();
    return cell.getColumnIndex(false, false) === +row.hasMultiSelectColumn();
}
