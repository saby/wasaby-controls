import type { Model } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import type { CrudEntityKey } from 'Types/source';
import type { TItemActionShowType, TIconStyle } from 'Controls/interface';

/**
 * Тип опции записи в списке.
 */
export interface IAction {
    id?: CrudEntityKey;
    parent?: TKey;
    'parent@'?: boolean | null;
    actionName?: string;
    commandName?: string;
    commandOptions?: object;
    viewCommandName?: string;
    viewCommandOptions?: object;
    storeId?: string;

    // region action with handler config:

    icon?: string;
    title?: string;
    showType?: TItemActionShowType;
    iconStyle?: TIconStyle;
    onExecuteHandler?: string | Function;

    // endregion action with handler config:
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
    listActions?: IAction[];

    /**
     * Набор опций записей в списке.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ "Конфигурация опций записей в списке".}
     */
    itemActions?: IAction[];
    itemActionsProperty?: string;
    itemActionsMap?: TItemActionsMap;
    /**
     * Колбек, определяющий видимость опции записи.
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
}
