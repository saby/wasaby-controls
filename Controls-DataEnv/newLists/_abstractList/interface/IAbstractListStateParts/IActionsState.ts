import type { Model } from 'Types/entity';
import type { TKey } from 'Controls-DataEnv/interface';
import type { IAction } from 'Controls-DataEnv/listTypes';

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
     * Набор действий для панели массовых операций
     * @remark
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ "Связь панели массовых операций и списка"}.
     */
    listActions?: IAction[];

    /**
     * Набор опций записей в списке
     * @remark
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ "Конфигурация опций записей в списке"}.
     */
    itemActions?: IAction[];

    /**
     * Имя поля записи, в котором хранится конфигурация для панели с {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опциями записи}
     * @remark
     * С помощью этой опции можно задать конфигурацию набора опций для каждой записи.
     * Подробнее об использовании функционала читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/separate-set-options/#item-actions-property здесь}.
     * @example
     * <pre class="brush: js">
     * this._viewSource = new source.Memory({
     *    keyProperty: 'id',
     *    data: [
     *       {
     *          id: 0,
     *          title: 'The agencies’ average client makes about $32,000 a year.',
     *          itemActions: [
     *             {
     *                id: 1,
     *                title: 'Прочитано',
     *                showType: TItemActionShowType.TOOLBAR,
     *             },
     *             {
     *                id: 2,
     *                icon: 'icon-PhoneNull',
     *                title: 'Позвонить',
     *                showType: TItemActionShowType.MENU_TOOLBAR,
     *             },
     *             {
     *                id: 3,
     *                icon: 'icon-EmptyMessage',
     *                title: 'Написать',
     *                showType: TItemActionShowType.TOOLBAR,
     *             }
     *          ]
     *       },
     *       ...
     *    ]
     * });
     * </pre>
     * @see itemActions
     */
    itemActionsProperty?: string;

    /**
     * Модель, описывающая набор операций для каждой записи
     */
    itemActionsMap?: TItemActionsMap;

    /**
     * Функция обратного вызова для определения видимости {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ опций записи}
     * @remark
     * Подробнее об использовании функции читайте {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/separate-set-options/#visibility здесь}.
     * @see itemActions
     * @see itemActionsProperty
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
}
