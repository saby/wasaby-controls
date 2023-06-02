import type { TItemActionsVisibility } from 'Controls/itemActions';

/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
export default interface IItemActionsCell {
    readonly SupportItemActions: boolean;
    getActionsVisibility(
        actionsVisibility: TItemActionsVisibility
    ): TItemActionsVisibility;
}
