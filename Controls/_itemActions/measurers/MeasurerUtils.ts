/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { IItemAction } from 'Controls/interface';
import { TItemActionShowType } from '../constants';
import { IShownItemAction } from '../interface/IItemActionsObject';

/**
 * Утилиты для измерения опций свайпа, которые нужно показать на странице
 * @private
 */
export class MeasurerUtils {
    /**
     * Возвращает набор операций над записью, которые нужно показать на странице.
     * Фильтрует все элементы, у которых нет родителя и сортирует их по TItemActionShowType.
     * Т.е. Сначала TOOLBAR, MENU_TOOLBAR и в конце MENU.
     * FIXED операции над записью не сортируются, они долны оставаться на том же месте, где они и есть.
     * Работает для свайпа и плитки, в которой динамически меняется число показанных ItemActions от ширины плитки
     * @param actions
     */
    static getActualActions(actions: IShownItemAction[]): IShownItemAction[] {
        const itemActions = actions.filter((action) => {
            return !action.parent;
        });
        itemActions.sort((action1: IShownItemAction, action2: IShownItemAction) => {
            if (
                action2.showType === TItemActionShowType.FIXED ||
                action1.showType === TItemActionShowType.FIXED
            ) {
                return 0;
            }
            return (
                (action2.showType || TItemActionShowType.MENU) -
                (action1.showType || TItemActionShowType.MENU)
            );
        });
        return itemActions;
    }

    static getFixedActions(itemActions: IItemAction[]): IItemAction[] {
        return itemActions.filter((action) => {
            return action.showType === TItemActionShowType.FIXED;
        });
    }

    /**
     * Отрезает ItemActions, которые не уместились.
     * Перемещает FIXED ItemActions в конец массива, заменяя видимые элементы, если FIXED вдруг оказались отрезаны.
     * @param itemActions операции над записью
     * @param sliceLength
     */
    static sliceAndFixActions(
        itemActions: IItemAction[],
        sliceLength?: number
    ): IShownItemAction[] {
        // Отрезаем сколько хотим увидеть
        const visibleActions = itemActions.slice(0, sliceLength);
        if (sliceLength) {
            // Смотрим, осталось ли что-то в остатке
            const slicedFixedActions = this.getFixedActions(itemActions.slice(sliceLength));
            // Смотрим ещё, были ли в видимых записях FIXED
            const visibleFixedActions = this.getFixedActions(visibleActions);
            // Если в видимых записях были FIXED, то следующий алгоритм смещает положение видимых FIXED так,
            // чтобы FIXED, добавленные из остатка не перекрывали их
            if (visibleFixedActions.length) {
                let lastVisibleFixedAction = visibleFixedActions.pop();
                const delta = visibleActions.length - slicedFixedActions.length;
                while (
                    lastVisibleFixedAction &&
                    delta <= visibleActions.indexOf(lastVisibleFixedAction)
                ) {
                    slicedFixedActions.unshift(lastVisibleFixedAction);
                    lastVisibleFixedAction = visibleFixedActions.pop();
                }
            }
            // Заменяем с конца видимые записи на FIXED из остатка
            if (slicedFixedActions.length) {
                visibleActions.splice(
                    -slicedFixedActions.length,
                    slicedFixedActions.length,
                    ...slicedFixedActions
                );
            }
        }
        return visibleActions;
    }
}
