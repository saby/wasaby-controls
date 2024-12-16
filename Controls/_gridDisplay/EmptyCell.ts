/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { mixin } from 'Types/util';
import EmptyRow from './EmptyRow';
import Cell, { IOptions as IBaseCellOptions } from './Cell';
import CellCompatibility from './compatibility/DataCell';

/**
 * Ячейка строки пустого представления таблицы
 * @private
 */
class EmptyCell extends mixin<Cell<null, EmptyRow>, CellCompatibility<null>>(
    Cell,
    CellCompatibility
) {
    protected readonly _defaultCellTemplate: string = undefined;

    readonly listInstanceName: string = 'controls-Grid__empty';

    getHasEmptyView() {
        return this.getOwner().getHasEmptyView();
    }
}

Object.assign(EmptyCell.prototype, {
    $GEC: true, // GridEmptyCell
    _moduleName: 'Controls/grid:GridEmptyCell',
    _instancePrefix: 'grid-empty-cell-',
});

export default EmptyCell;
export { EmptyCell, IBaseCellOptions as IOptions };
