/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

import type { IListState } from 'Controls-DataEnv/list';

export const marker: TListMiddleware =
    ({ getState, setState, dispatch, getCollection }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'mark': {
                const { markerVisibility, searchValue } = getState();

                //# region Обновление маркера
                if (markerVisibility === 'hidden') {
                    break;
                }
                await dispatch(ListWebActions.marker.setMarkedKey(action.payload.key));
                //# endregion

                //# region Сайд-эффекты
                await dispatch(ListWebActions.source.updateSavedState());
                //# endregion Сайд-эффекты

                if (
                    !searchValue &&
                    typeof action.payload.key !== 'undefined' &&
                    action.payload.key !== null
                ) {
                    await dispatch(
                        ListWebActions.expandCollapse.expandParent(action.payload.key, false)
                    );
                }
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
                const { keys, index } = action.payload;
                const { markedKey } = getState();

                if (isMarkerExists(markedKey) && keys.includes(markedKey as CrudEntityKey)) {
                    await dispatch(ListWebActions.marker.markNearbyItem(index));
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
                    await dispatch(
                        ListWebActions.marker.mark(collection.getFirst('Markable')?.key)
                    );
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
                    await dispatch(ListWebActions.marker.markNearbyItem(removedItemsIndex));
                } else if (
                    collection &&
                    !isMarkerExists(markedKey) &&
                    shouldMarkerAlwaysBeVisible(markerVisibility, collection)
                ) {
                    await dispatch(
                        ListWebActions.marker.mark(collection.getFirst('Markable')?.key)
                    );
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
