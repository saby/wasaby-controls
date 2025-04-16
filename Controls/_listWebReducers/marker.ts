/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddleware, IListState } from 'Controls-DataEnv/list';
import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import type { TKey } from 'Controls-DataEnv/interface';

import { ListActionCreators } from 'Controls-DataEnv/list';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

const {
    marker: markerActions,
    source: sourceActions,
    expandCollapse: expandCollapseActions,
    operationsPanel: operationsPanelActions,
} = ListActionCreators;

export const marker: TListMiddleware =
    ({ getState, setState, dispatch, getCollection }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'mark': {
                const { markerVisibility, viewMode } = getState();

                //# region Обновление маркера
                if (markerVisibility === 'hidden') {
                    break;
                }
                await dispatch(markerActions.setMarkedKey(action.payload.key));
                //# endregion

                //# region Сайд-эффекты
                await dispatch(sourceActions.updateSavedState());
                //# endregion Сайд-эффекты

                if (
                    !(viewMode === 'search' || viewMode === 'searchTile') &&
                    typeof action.payload.key !== 'undefined' &&
                    action.payload.key !== null
                ) {
                    await dispatch(expandCollapseActions.expandParent(action.payload.key, false));
                }
                break;
            }
            case 'setMarkedKey': {
                setState({
                    markedKey: action.payload.key,
                });
                await dispatch(operationsPanelActions.updateOperationsSelection());
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
                    const collection = getCollection();

                    const shouldSetMarkerOnFirstItem =
                        // TODO: проверка collection - временное решение. Поправится с поддержкой всех коллекций
                        (!!collection && state.markedKey === undefined) || state.markedKey === null;

                    if (shouldSetMarkerOnFirstItem && collection) {
                        setState({
                            markedKey: calculateMarkedKeyForVisible(state, collection),
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

                await dispatch(markerActions.setMarkerVisibility('visible'));

                break;
            }
            case 'markNearbyItem': {
                // TODO: временное решение. Поправится с поддержкой всех коллекций
                const collection = getCollection();
                if (!collection) {
                    break;
                }
                // TODO: убрать index по задаче
                // https://online.sbis.ru/opendoc.html?guid=aa34261b-6568-428f-b8f6-3b68c970443d&client=3
                let { index } = action.payload;
                const { key } = action.payload;

                if (typeof key !== 'undefined') {
                    index = collection.getIndexByKey(key);
                }

                const newMarker = await calculateNearbyItemKey(
                    collection,
                    calculateIndexWithSpaceRows(index, collection)
                );
                await dispatch(markerActions.mark(newMarker));
                break;
            }
            case 'markNext': {
                const collection = getCollection();
                if (!collection) {
                    break;
                }

                if (action.payload.direction) {
                    const strategy = (
                        await loadAsync<typeof import('Controls/marker')>('Controls/marker')
                    ).getMarkerStrategy(collection);
                    const newMarker = strategy.getMarkedKeyByDirection(
                        getState(),
                        collection,
                        action.payload.direction
                    );
                    await dispatch(markerActions.mark(newMarker));
                }
                break;
            }
            case 'onItemsRemoved': {
                const { keys, index } = action.payload;
                const { markedKey } = getState();

                if (isMarkerExists(markedKey) && keys.includes(markedKey as CrudEntityKey)) {
                    await dispatch(markerActions.markNearbyItem(index));
                }

                break;
            }
            case 'onAllItemsReplaced': {
                const { items } = action.payload;
                const { markedKey } = getState();
                const collection = getCollection();
                if (
                    collection &&
                    isMarkerExists(markedKey) &&
                    !items.getRecordById(markedKey as CrudEntityKey)
                ) {
                    await dispatch(markerActions.mark(collection.getFirst('Markable')?.key));
                }
                break;
            }
            case 'onItemsReset': {
                const { newItems, oldItems, removedItemsIndex } = action.payload;
                const { markerVisibility, markedKey } = getState();
                const collection = getCollection();

                if (
                    isMarkerExists(markedKey) &&
                    oldItems.find((i) => i.getKey() === markedKey) &&
                    !newItems.find((i) => i.getKey() === markedKey)
                ) {
                    await dispatch(markerActions.markNearbyItem(removedItemsIndex));
                } else if (
                    collection &&
                    !isMarkerExists(markedKey) &&
                    shouldMarkerAlwaysBeVisible(markerVisibility, collection)
                ) {
                    await dispatch(markerActions.mark(collection.getFirst('Markable')?.key));
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
    collection?.getItems()?.every((item, idx) => {
        if (
            item['[Controls/_display/SpaceCollectionItem]' as keyof typeof item] &&
            idx <= resIndex
        ) {
            resIndex++;
        } else if (idx >= resIndex) {
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

function calculateMarkedKeyForVisible(
    state: IListState,
    collection: ICollection
): TKey | undefined {
    // TODO удалить этот метод, когда избавимся от onactivated
    let newMarkedKey = state.markedKey;
    const item =
        typeof newMarkedKey === 'undefined'
            ? undefined
            : collection.getItemBySourceKey(newMarkedKey);

    if (collection.getCount() && (!item || !item.Markable)) {
        newMarkedKey = collection.getFirst('Markable')?.key;
    }

    return newMarkedKey;
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

function isMarkerExists(prevStateMarkedKey: IListState['markedKey']): boolean {
    return !(prevStateMarkedKey === null || typeof prevStateMarkedKey === 'undefined');
}
