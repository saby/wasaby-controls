import type { TItemActionsVisibility } from 'Controls/itemActions';

/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
export default interface IItemActionsCell {
    readonly SupportItemActions: boolean;
    getActionsVisibility(actionsVisibility: TItemActionsVisibility): TItemActionsVisibility;
}
