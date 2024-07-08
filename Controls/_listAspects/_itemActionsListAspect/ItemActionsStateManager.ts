import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { TKey } from 'Controls/interface';
import type { Collection as ICollection, IBaseCollection } from 'Controls/display';
import { IAction, TItemActionsMap } from './common/types';

import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange, ListChangeNameEnum } from '../_abstractListAspect/common/ListChanges';
import {
    copyItemActionsState,
    IItemActionsState,
} from '../_itemActionsListAspect/ItemActionsState';
import {
    ItemActionsChangeName,
    TItemActionsChanges,
} from '../_itemActionsListAspect/TItemActionsChanges';
import { FirstItemKeySymbol } from '../_itemsListAspect/TItemsChanges';
import { fixStateWithItems } from '../_abstractListAspect/common/IStateWithItems';

/**
 * Возвращает действия над записью для каждого элемента списка.
 * @param item
 * @param state
 */
function getActionsForItem(item: Model, state: IItemActionsState): IAction[] {
    let actions: IAction[];
    // Предзагрузка происходит только для тех экшнов, которые указаны на слайсе,
    // поэтому их надо там указывать независимо от того, что экшны для каждой записи приходят в itemActionsProperty.
    if (state.itemActionsProperty) {
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

/**
 * Создаёт новую карту ItemActions с парами ключ=>экшны
 * @param items
 * @param state
 */
function createActionsMap(
    items: RecordSet | Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>,
    state: IItemActionsState
): TItemActionsMap {
    const map: TItemActionsMap = new Map<TKey, IAction[]>();
    items.forEach((item: Model) => {
        map.set(item.getKey(), getActionsForItem(item, state));
    });
    return map;
}

export class ItemActionsStateManager<
    TCollection extends IBaseCollection = IBaseCollection
> extends AbstractAspectStateManager<IItemActionsState, TCollection> {
    resolveChanges(
        prevState: Partial<IItemActionsState>,
        nextState: Partial<IItemActionsState>
    ): IListChange[] {
        const hasChanges = (
            [
                'itemActionsProperty',
                'itemActions',
                'itemActionVisibilityCallback',
            ] as (keyof IItemActionsState)[]
        ).some((prop) => {
            return prevState[prop] !== nextState[prop];
        });
        const changes = [] as IListChange[];
        if (hasChanges) {
            changes.push(
                ItemActionsStateManager._getItemActionsMapChange(
                    nextState.items as RecordSet,
                    nextState as IItemActionsState
                )
            );
        }
        return changes;
    }

    getNextState(state: IItemActionsState, changes: IListChange[]): IItemActionsState {
        const nextState = copyItemActionsState(state);
        for (const change of changes) {
            switch (change.name) {
                case ItemActionsChangeName:
                    // Этот кейс сработает, когда изменились пропсы типа itemActions, itemActionsProperty etc.
                    if (nextState.itemActionsMap) {
                        change.args.itemActionsMap?.forEach((value, key) => {
                            nextState.itemActionsMap.set(key, value);
                        });
                    }
                    break;
                case ListChangeNameEnum.REMOVE_ITEMS:
                    // При удалении записей, удаляем и из карты.
                    if (nextState.itemActionsMap) {
                        change.args.keys.forEach((value) => {
                            nextState.itemActionsMap.delete(value);
                        });
                    }
                    break;
                case ListChangeNameEnum.APPEND_ITEMS:
                case ListChangeNameEnum.PREPEND_ITEMS:
                case ListChangeNameEnum.REPLACE_ALL_ITEMS:
                case ListChangeNameEnum.REPLACE_ITEMS:
                    if (nextState.itemActions?.length) {
                        // TODO на мобильном слайсе при initState ещё нет items,
                        //  и инициализировать itemActions там нет смысла. Единственное место,
                        //  где пока мы можем понять, что появились items, это на getNextState.
                        //  Поэтому тут мы просто устанавливаем карту в стейт.
                        //  Интересно, что на "толстом" интеракторе этот фокус не сработает, т.к.
                        //  данные приходят и предзагрузки. В этом случае нужно
                        //  при инициализации слайса вызывать initItemActions.
                        const nextItemActionsMap = createActionsMap(change.args.items, nextState);
                        if (!nextState.itemActionsMap) {
                            nextState.itemActionsMap = nextItemActionsMap;
                        } else {
                            nextItemActionsMap?.forEach((value, key) => {
                                nextState.itemActionsMap.set(key, value);
                            });
                        }
                    }
                    break;
            }
        }

        return fixStateWithItems(nextState) as IItemActionsState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[],
        nextState: IItemActionsState
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case ItemActionsChangeName:
                    collection.updateInteractorStateProps({
                        itemActionsMap: change.args.itemActionsMap,
                    });
                    break;
                case ListChangeNameEnum.APPEND_ITEMS:
                case ListChangeNameEnum.PREPEND_ITEMS:
                case ListChangeNameEnum.REPLACE_ALL_ITEMS:
                case ListChangeNameEnum.REPLACE_ITEMS:
                    // Жесткий костыль, аспекты не справились с требованиями списка.
                    // До внедрения мидлвары экшенов.
                    if (collection.isThinInteractor() && nextState.itemActionsMap) {
                        nextState.itemActionsMap = createActionsMap(
                            collection.getSourceCollection(),
                            nextState
                        );
                    }

                    // Если в nextState есть карта просто применяем её в коллекцию.
                    // в этом случае карта уже содержит актуальные значения.
                    if (nextState.itemActionsMap) {
                        collection.updateInteractorStateProps({
                            itemActionsMap: nextState.itemActionsMap,
                        });
                    }
                    break;
            }
        }
    }

    /**
     * Инициализация действий над записью при инициализации слайса.
     * Метод вызывается только в "толстом" интеракторе, когда есть данные предзагрузки.
     * @param state
     * @param collection
     */
    initItemActions<TCollection extends ICollection>(
        state: IItemActionsState,
        collection: TCollection
    ): void {
        if (state.itemActions?.length) {
            // Сохраняем на стейте для удобного манипулирования данными
            state.itemActionsMap = createActionsMap(state.items, state);
            collection.updateInteractorStateProps({
                itemActionsMap: state.itemActionsMap,
            });
        }
    }

    private static _getItemActionsMapChange(
        items: RecordSet | Map<CrudEntityKey | typeof FirstItemKeySymbol, Model>,
        nextState: IItemActionsState
    ): TItemActionsChanges {
        return {
            name: ItemActionsChangeName,
            args: {
                itemActionsMap: createActionsMap(items, nextState),
            },
        };
    }
}

export function itemActionsStateManagerFactory(): ItemActionsStateManager {
    return new ItemActionsStateManager();
}
