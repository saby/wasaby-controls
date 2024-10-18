/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';

import {
    convertCollectionChangesToListChanges,
    IAppendItemsChange,
    IMarkerState,
    IPrependItemsChange,
    IRemoveItemsChange,
    IReplaceAllItemsChange,
    ListChangeNameEnum,
    TItemsChanges,
    ReplaceAllItemsChangeName,
} from 'Controls/listAspects';
import { CrudEntityKey } from 'Types/source';
import { Collection as ICollection } from 'Controls/display';

function getChange<ChangeType>(
    changeName: string,
    changes: TItemsChanges[]
): ChangeType | undefined {
    return changes.find((c) => c.name === changeName) as ChangeType | undefined;
}

export const items: TListMiddleware =
    ({ getState, dispatch, getCollection }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'complexUpdateItems': {
                const { prevState, nextState } = action.payload;
                const changes = [];
                if (nextState.items && prevState.items !== nextState.items) {
                    changes.push({
                        name: ReplaceAllItemsChangeName,
                        args: {
                            items: nextState.items,
                        },
                    });
                } else if (nextState.itemsChanges?.length) {
                    changes.push(
                        ...convertCollectionChangesToListChanges(
                            nextState.items,
                            nextState.itemsChanges
                        )
                    );
                }

                //#region Сайд-эффекты

                if (changes.length) {
                    const { isRemoved, handledChange } = checkIsMarkedItemRemoved(
                        prevState,
                        changes
                    );
                    if (isRemoved && handledChange) {
                        await dispatch(
                            ListWebActions.marker.markNearbyItem(handledChange.args.index)
                        );
                    } else if (shouldMarkFirst(changes, prevState, getState())) {
                        await dispatch(
                            ListWebActions.marker.setMarkedKey(
                                getCollection().getFirst('Markable')?.key
                            )
                        );
                    }
                }
                //#region Сайд-эффекты
                break;
            }
        }

        next(action);
    };

function hasMarkedInAdded(itemsChanges: TItemsChanges[], markerKey?: CrudEntityKey): boolean {
    const appendChange = getChange<IAppendItemsChange>(
        ListChangeNameEnum.APPEND_ITEMS,
        itemsChanges
    );
    const prependChange = getChange<IPrependItemsChange>(
        ListChangeNameEnum.PREPEND_ITEMS,
        itemsChanges
    );

    const addedItemsMap = (
        (appendChange || prependChange) as IAppendItemsChange | IPrependItemsChange
    )?.args?.items;

    return (
        !!addedItemsMap &&
        !!addedItemsMap.size &&
        !!Array.from(addedItemsMap.values()).find((i) => i.getKey() === markerKey)
    );
}

function checkIsMarkedItemRemoved(
    prevState: IMarkerState,
    itemsChanges: TItemsChanges[]
): { isRemoved: boolean; handledChange: undefined | IRemoveItemsChange } {
    const removeChange = getChange<IRemoveItemsChange>(
        ListChangeNameEnum.REMOVE_ITEMS,
        itemsChanges
    );
    const appendChange = getChange<IAppendItemsChange>(
        ListChangeNameEnum.APPEND_ITEMS,
        itemsChanges
    );
    const prependChange = getChange<IPrependItemsChange>(
        ListChangeNameEnum.PREPEND_ITEMS,
        itemsChanges
    );
    let isRemoved = false;

    if (removeChange && isMarkedItemRemoved(prevState, removeChange)) {
        isRemoved = true;
        if (appendChange || prependChange) {
            isRemoved = !hasMarkedInAdded(itemsChanges, prevState.markedKey);
        }
    }

    return {
        isRemoved,
        handledChange: removeChange,
    };
}

function isMarkedItemRemoved(
    prevState: IMarkerState,
    change?: IRemoveItemsChange | IReplaceAllItemsChange
): boolean {
    if (!change || !isMarkerExists(prevState)) {
        return false;
    }

    if (change.name === ListChangeNameEnum.REPLACE_ALL_ITEMS) {
        return !change.args.items.getRecordById(prevState.markedKey as CrudEntityKey);
    } else {
        return !!change.args.keys.includes(prevState.markedKey as CrudEntityKey);
    }
}

function isMarkerExists(state: IMarkerState): boolean {
    return !(state.markedKey === null || typeof state.markedKey === 'undefined');
}
function shouldMarkFirst(
    itemsChanges: TItemsChanges[],
    prevState: IMarkerState,
    nextState: IMarkerState
): boolean {
    if (isMarkerPreviouslyDoesntExist(itemsChanges, prevState, nextState)) {
        return true;
    }

    const replaceAllChange = getChange<IReplaceAllItemsChange>(
        ListChangeNameEnum.REPLACE_ALL_ITEMS,
        itemsChanges
    );

    return !!(replaceAllChange && isMarkedItemRemoved(prevState, replaceAllChange));
}
function isMarkerPreviouslyDoesntExist(
    itemsChanges: TItemsChanges[],
    prevState: IMarkerState,
    nextState: IMarkerState
): boolean {
    const removeChange = getChange<IRemoveItemsChange>(
        ListChangeNameEnum.REMOVE_ITEMS,
        itemsChanges
    );
    const appendChange = getChange<IAppendItemsChange>(
        ListChangeNameEnum.APPEND_ITEMS,
        itemsChanges
    );
    const prependChange = getChange<IPrependItemsChange>(
        ListChangeNameEnum.PREPEND_ITEMS,
        itemsChanges
    );
    return (
        !!removeChange &&
        !!(appendChange || prependChange) &&
        !isMarkerExists(prevState) &&
        shouldMarkerAlwaysBeVisible(nextState, nextState.collection)
    );
}

function shouldMarkerAlwaysBeVisible<TCollection extends ICollection>(
    state: IMarkerState,
    collection?: TCollection
): boolean {
    return state.markerVisibility === 'visible' && !isCollectionEmpty(collection);
}

function isCollectionEmpty<TCollection extends ICollection>(collection?: TCollection): boolean {
    return !collection?.getCount();
}
