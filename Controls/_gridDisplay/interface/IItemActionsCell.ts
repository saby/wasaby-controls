/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type { TItemActionsVisibility } from 'Controls/itemActions';

/**
 * Инерфейс модели ячейки таблицы, содержащей операции над записью
 * @private
 */
export default interface IItemActionsCell {
    readonly SupportItemActions: boolean;
    getActionsVisibility(actionsVisibility: TItemActionsVisibility): TItemActionsVisibility;
}
