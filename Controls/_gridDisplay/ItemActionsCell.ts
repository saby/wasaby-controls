/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import Row from './Row';
import Cell, { IOptions as ICellOptions } from './Cell';
import IItemActionsCell from './interface/IItemActionsCell';
import type { TItemActionsVisibility } from 'Controls/itemActions';

export type IOptions = ICellOptions<null>;
/**
 * Ячейка с действиями над записью
 * @private
 */
export default class ItemActionsCell extends Cell<null, Row<null>> implements IItemActionsCell {
    readonly SupportItemActions: true = true;
    readonly listInstanceName: string = 'controls-Grid__actions';

    readonly listElementName: string = 'actions-cell';

    shouldDisplayItemActions(): boolean {
        return !!this._$owner.DisplayItemActions && this._$owner.shouldDisplayItemActions();
    }

    getActionsVisibility(actionsVisibility: TItemActionsVisibility): TItemActionsVisibility {
        return this.shouldDisplayItemActions() ? actionsVisibility : 'hidden';
    }
}

Object.assign(ItemActionsCell.prototype, {
    '[Controls/_display/grid/ItemActionsCell]': true,
    _moduleName: 'Controls/display:ItemActionsCell',
    _instancePrefix: 'grid-item-actions-cell-',
});
