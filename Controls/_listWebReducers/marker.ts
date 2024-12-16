/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

import type { IListState, TListActions } from 'Controls-DataEnv/list';

export const marker: TListMiddleware =
    ({ getState, setState, dispatch, getCollection }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'mark': {
                //# region Обновление маркера
                if (getState().markerVisibility === 'hidden') {
                    break;
                }
                await dispatch(ListWebActions.marker.setMarkedKey(action.payload.key));
                //# endregion

                //# region Сайд-эффекты
                await dispatch(ListWebActions.source.updateSavedState());
                //# endregion Сайд-эффекты
                break;
            }
            case 'setMarkedKey': {
                setState({
                    markedKey: action.payload.key,
                });
                await dispatch(ListWebActions.operationsPanel.updateOperationsSelection());
                break;
            }
            case 'setMarkerVisibility': {
                const markerVisibility = action.payload.visibility;

                setState({
                    markerVisibility,
                });

                const state = getState();

                if (markerVisibility === 'hidden') {
                    setState({ markedKey: null });
                } else if (markerVisibility === 'visible') {
                    const shouldSetMarkerOnFirstItem =
                        // TODO: getCollection - временное решение. Поправится с поддержкой всех коллекций
                        (!!getCollection() && state.markedKey === undefined) ||
                        state.markedKey === null;

                    if (shouldSetMarkerOnFirstItem) {
                        setState({
                            markedKey: calculateMarkedKeyForVisible(state, getCollection()),
                        });
                    }
                }

                break;
            }
            case 'activateMarker': {
                // Не можем показать маркер, т.к. он скрыт вообще.
                if (getState().markerVisibility === 'hidden') {
                    break;
                }

                await dispatch(ListWebActions.marker.setMarkerVisibility('visible'));

                break;
            }
            case 'markNearbyItem': {
                // TODO: временное решение. Поправится с поддержкой всех коллекций
                if (!getCollection()) {
                    break;
                }
                // TODO: убрать index по задаче
                // https://online.sbis.ru/opendoc.html?guid=aa34261b-6568-428f-b8f6-3b68c970443d&client=3
                const { index } = action.payload;
                const newMarker = await calculateNearbyItemKey(
                    getCollection(),
                    calculateIndexWithSpaceRows(index, getCollection())
                );
                await dispatch(ListWebActions.marker.mark(newMarker));
                break;
            }
            case 'markNext': {
                if (action.payload.direction) {
                    const strategy = (
                        await loadAsync<typeof import('Controls/marker')>('Controls/marker')
                    ).getMarkerStrategy(getCollection());
                    const newMarker = strategy.getMarkedKeyByDirection(
                        getState(),
                        getCollection(),
                        action.payload.direction
                    );
                    await dispatch(ListWebActions.marker.mark(newMarker));
                }
                break;
            }
            case 'onItemsRemoved': {
                const { keys, index, actionArray, prevStateMarkedKey } = action.payload;

                if (
                    isMarkerExists(prevStateMarkedKey) &&
                    keys.includes(prevStateMarkedKey as CrudEntityKey) &&
                    !hasMarkedInAdded(actionArray, prevStateMarkedKey)
                ) {
                    await dispatch(ListWebActions.marker.markNearbyItem(index));
                } else {
                    await dispatch(
                        ListWebActions.items.onItemsAdded(actionArray, prevStateMarkedKey)
                    );
                }
                break;
            }
            case 'onItemsAdded': {
                const { actionArray, prevStateMarkedKey } = action.payload;
                const { markerVisibility } = getState();
                const collection = getCollection();

                const removeAction = getAction(actionArray, 'removeItems') as
                    | TListActions.items.TRemoveItemsAction
                    | undefined;
                const appendAction = getAction(actionArray, 'appendItems') as
                    | TListActions.items.TAppendItemsAction
                    | undefined;
                const prependAction = getAction(actionArray, 'prependItems') as
                    | TListActions.items.TPrependItemsAction
                    | undefined;
                if (
                    !!removeAction &&
                    !!(appendAction || prependAction) &&
                    !isMarkerExists(prevStateMarkedKey) &&
                    shouldMarkerAlwaysBeVisible(markerVisibility, collection)
                ) {
                    await dispatch(
                        ListWebActions.marker.mark(collection.getFirst('Markable')?.key)
                    );
                }
                break;
            }
            case 'onAllItemsReplaced': {
                const { prevStateMarkedKey, items } = action.payload;
                if (
                    isMarkerExists(prevStateMarkedKey) &&
                    !items.getRecordById(prevStateMarkedKey as CrudEntityKey)
                ) {
                    await dispatch(
                        ListWebActions.marker.mark(getCollection().getFirst('Markable')?.key)
                    );
                }
                break;
            }
            case 'complexUpdateMarker': {
                const { prevState, nextState } = action.payload;

                if (prevState.markerVisibility !== nextState.markerVisibility) {
                    // Не скрываем маркер, если открыто ПМО и прикладной разработчик
                    // пытается скрыть маркер.
                    const shouldIgnoreVisibilityChange =
                        nextState.operationsPanelVisible && nextState.markerVisibility === 'hidden';

                    // Если идет смена модели с поддерживаемой на неподдерживаемую,
                    // то в некоторых случаях не нужно проставлять маркер.
                    // Например, если маркер прикладным разработчиком не задан.
                    // У нас нет точек в слайсе, чтобы понять, задан ли маркер и нет точки,
                    // чтобы понять, какая модель будет следующая.
                    // Ошибка https://online.sbis.ru/opendoc.html?guid=883d4c50-ea09-41fb-8ba0-84178b820f6b&client=3
                    // Чтобы таких ошибок не было, нужно поддержать все модели.
                    // Задача https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
                    const isNextModelSupported = nextState.fix1193265616 !== true;

                    if (isNextModelSupported && !shouldIgnoreVisibilityChange) {
                        await dispatch(
                            ListWebActions.marker.setMarkerVisibility(nextState.markerVisibility)
                        );
                    }
                }

                if (prevState.markedKey !== nextState.markedKey) {
                    await dispatch(ListWebActions.marker.mark(nextState.markedKey));
                }

                break;
            }
        }

        next(action);
    };

function calculateIndexWithSpaceRows<TCollection extends ICollection>(
    index: number,
    collection: TCollection
): number {
    let resIndex = index;
    collection?.getItems()?.every((item, index) => {
        if (item['[Controls/_display/SpaceCollectionItem]'] && index <= resIndex) {
            resIndex++;
        } else if (index >= resIndex) {
            return false;
        }
        return true;
    });

    return resIndex;
}

async function calculateNearbyItemKey<TCollection extends ICollection>(
    collection: TCollection,
    deletedRSIndex: number
): Promise<CrudEntityKey | null> {
    const strategy = (
        await loadAsync<typeof import('Controls/marker')>('Controls/marker')
    ).getMarkerStrategy(collection, {
        // TODO реализовать moveMarkerOnScrollPaging
        moveMarkerOnScrollPaging: undefined,
    });

    // Считаем ключ следующего элемента
    let newMarkedKey = strategy.oldGetNextMarkedKey(collection, deletedRSIndex);

    // Считаем ключ предыдущего элемента, если следующего нет
    if (newMarkedKey === null) {
        newMarkedKey = strategy.oldGetPrevMarkedKey(collection, deletedRSIndex);
    }

    return newMarkedKey;
}

function calculateMarkedKeyForVisible<TCollection extends ICollection>(
    state: IListState,
    collection: TCollection
): CrudEntityKey {
    // TODO удалить этот метод, когда избавимся от onactivated
    let newMarkedKey = state.markedKey;
    const item = collection.getItemBySourceKey(newMarkedKey);
    if (
        state.markerVisibility === 'visible' &&
        collection.getCount() &&
        (!item || !item.Markable)
    ) {
        newMarkedKey = collection.getFirst('Markable')?.key;
    }

    return newMarkedKey;
}

function hasMarkedInAdded(
    actionArray: TListActions.items.TAnyItemsAction[],
    prevStateMarkedKey: IListState['markedKey']
): boolean {
    const appendAction = getAction(actionArray, 'appendItems') as
        | TListActions.items.TAppendItemsAction
        | undefined;
    const prependAction = getAction(actionArray, 'prependItems') as
        | TListActions.items.TPrependItemsAction
        | undefined;

    const addedItemsMap = (appendAction || prependAction)?.payload?.items;

    return (
        !!addedItemsMap &&
        !!addedItemsMap.size &&
        !!Array.from(addedItemsMap.values()).find((i) => i.getKey() === prevStateMarkedKey)
    );
}

function shouldMarkerAlwaysBeVisible<TCollection extends ICollection>(
    nextStateMarkerVisibility: IListState['markerVisibility'],
    collection?: TCollection
): boolean {
    return nextStateMarkerVisibility === 'visible' && !isCollectionEmpty(collection);
}

function isCollectionEmpty<TCollection extends ICollection>(collection?: TCollection): boolean {
    return !collection?.getCount();
}

function getAction(
    actionArray: TListActions.items.TAnyItemsAction[],
    actionType: 'removeItems' | 'prependItems' | 'appendItems'
): TListActions.items.TAnyItemsAction | undefined {
    return actionArray.find((a) => a.type === actionType);
}

function isMarkerExists(prevStateMarkedKey: IListState['markedKey']): boolean {
    return !(prevStateMarkedKey === null || typeof prevStateMarkedKey === 'undefined');
}
