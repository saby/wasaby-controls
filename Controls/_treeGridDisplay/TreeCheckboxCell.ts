/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { CheckboxCell } from 'Controls/gridDisplay';
import TreeGridDataRow from './TreeGridDataRow';

/**
 * Ячейка иерархической коллекции, в которой отображается чекбокс множественного выбора
 * @private
 */
export default class TreeCheckboxCell<
    TOwner extends TreeGridDataRow = TreeGridDataRow
> extends CheckboxCell<null, TOwner> {}

Object.assign(TreeCheckboxCell.prototype, {
    '[Controls/_treeGridDisplay/TreeCheckboxCell]': true,
    _moduleName: 'Controls/treeGrid:TreeCheckboxCell',
    _instancePrefix: 'tree-grid-checkbox-cell-',
    _$style: null,
});
