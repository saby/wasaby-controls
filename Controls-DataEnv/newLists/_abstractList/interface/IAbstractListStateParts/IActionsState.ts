import type { Model } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип опции записи в списке.
 */
export interface IAction {
    id: string;
    parent: TKey;
    'parent@': boolean;
    actionName: string;
    commandName: string;
    commandOptions: string;
    viewCommandName: string;
    viewCommandOptions: string;
}

/**
 * Модель опций записей в списке.
 */
export type TItemActionsMap = Map<TKey, IAction[]>;

/**
 * Колбек, определяющий видимость опции записи.
 */
export type TItemActionVisibilityCallback = (
    action: IAction,
    item: Model,
    isEditing: boolean // not implemented yet
) => boolean;

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
    itemActions?: IAction[];
    itemActionsProperty?: string;
    itemActionsMap?: TItemActionsMap;
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
}
