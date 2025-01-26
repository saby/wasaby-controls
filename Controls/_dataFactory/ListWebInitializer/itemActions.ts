import type { Collection as ICollection } from 'Controls/display';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';
import type { TKey } from 'Controls/interface';

/**
 * Инициализация действий над записью при инициализации слайса.
 * Метод вызывается только в "толстом" интеракторе, когда есть данные предзагрузки.
 * @param state
 * @param collection
 */
export function initItemActions<TCollection extends ICollection>(
    state,
    collection: TCollection
): void {
    if (state.itemActions?.length && isValidSliceItemActions(state.itemActions)) {
        // Сохраняем на стейте для удобного манипулирования данными
        state.itemActionsMap = createActionsMap(state.items, state);
        collection.updateInteractorStateProps({
            itemActionsMap: state.itemActionsMap,
        });
    }
}

/**
 * Возвращает true, если itemActions подходят для работы itemActionsStateManager.
 * Так происходит только в случае, если у экшнов есть actionName, и это путь до экшна.
 * @param actions
 */
export function isValidSliceItemActions(actions: IAction[]): boolean {
    return actions.every((action) => {
        return typeof action.actionName === 'string' && action.actionName.indexOf('/') !== -1;
    });
}

/**
 * Создаёт новую карту ItemActions с парами ключ=>экшны
 * @param items
 * @param state
 */
export function createActionsMap(
    items: RecordSet | Map<CrudEntityKey | undefined, Model>,
    state
): TItemActionsMap {
    const map: TItemActionsMap = new Map<TKey, IAction[]>();
    items.forEach((item: Model) => {
        map.set(item.getKey(), getActionsForItem(item, state));
    });
    return map;
}

/**
 * Возвращает действия над записью для каждого элемента списка.
 * @param item
 * @param state
 */
export function getActionsForItem(item: Model, state): IAction[] {
    let actions: IAction[];
    // Предзагрузка происходит только для тех экшнов, которые указаны на слайсе,
    // поэтому их надо там указывать независимо от того, что экшны для каждой записи приходят в itemActionsProperty.
    if (
        state.itemActionsProperty &&
        (item.get(state.itemActionsProperty)?.length || !state.itemActions?.length)
    ) {
        actions = item.get(state.itemActionsProperty);
        if (!actions) {
            actions = [];
        }
    } else {
        actions = state.itemActions;
    }

    // TODO isEditing
    const isEditing = false;

    return actions.reduce((result, action) => {
        if (
            !state.itemActionVisibilityCallback ||
            state.itemActionVisibilityCallback(action, item, isEditing)
        ) {
            result.push(action);
        }
        return result;
    }, [] as IAction[]);
}
