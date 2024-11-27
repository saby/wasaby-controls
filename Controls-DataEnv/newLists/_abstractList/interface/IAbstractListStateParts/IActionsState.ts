/**
 * Интерфейс состояния для работы с действиями над записями в списке с любым типом интерактора(web/mobile).
 */
export interface IActionsState {
    /**
     * Набор действий для панели массовых операций.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ "Связь панели массовых операций и списка".}
     */
    listActions?: unknown[];

    /**
     * Набор опций записей в списке.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ "Конфигурация опций записей в списке".}
     */
    itemActions?: unknown[];
}
