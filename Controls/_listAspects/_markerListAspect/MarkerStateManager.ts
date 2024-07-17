import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import {
    IAppendItemsChange,
    IPrependItemsChange,
    IRemoveItemsChange,
    TItemsChanges,
} from '../_itemsListAspect/TItemsChanges';
import {
    IListChange,
    IMoveMarkerListChange,
    ListChangeNameEnum,
} from '../_abstractListAspect/common/ListChanges';
import { copyMarkerState, IMarkerState } from './IMarkerState';
import { getMarkerStrategy } from './UILogic/getMarkerStrategy';

function calculateNearbyItemKey<TCollection extends ICollection>(
    state: IMarkerState,
    collection: TCollection,
    index: number
): CrudEntityKey | null {
    const strategy = getMarkerStrategy(collection, {
        // TODO реализовать moveMarkerOnScrollPaging
        moveMarkerOnScrollPaging: undefined,
    });
    // Считаем ключ следующего элемента
    let newMarkedKey = strategy.oldGetNextMarkedKey(collection, index);

    // Считаем ключ предыдущего элемента, если следующего нет
    if (newMarkedKey === null) {
        newMarkedKey = strategy.oldGetPrevMarkedKey(collection, index);
    }

    return newMarkedKey;
}

function isMarkerExists(state: IMarkerState): boolean {
    return !(state.markedKey === null || typeof state.markedKey === 'undefined');
}

function isCollectionEmpty<TCollection extends ICollection>(collection?: TCollection): boolean {
    return !collection?.getCount();
}

function shouldMarkerAlwaysBeVisible<TCollection extends ICollection>(
    state: IMarkerState,
    collection?: TCollection
): boolean {
    return state.markerVisibility === 'visible' && !isCollectionEmpty(collection);
}

function isMarkedItemRemoved(prevState: IMarkerState, removeChange?: IRemoveItemsChange): boolean {
    return isMarkerExists(prevState) && !!removeChange?.args.keys.includes(prevState.markedKey);
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

function getChange<ChangeType>(
    changeName: string,
    changes: TItemsChanges[]
): ChangeType | undefined {
    return changes.find((c) => c.name === changeName) as ChangeType | undefined;
}

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

export class MarkerStateManager extends AbstractAspectStateManager<IMarkerState> {
    resolveChanges(prevState: IMarkerState, nextState: IMarkerState): IListChange[] {
        const changes: IListChange[] = [];
        if (
            'markedKey' in nextState &&
            nextState.markerVisibility !== 'hidden' &&
            prevState.markedKey !== nextState.markedKey
        ) {
            // TODO . Необходимо использовать _strategy, чтобы убедиться в том, можно ли ставить маркер
            changes.push({
                name: ListChangeNameEnum.MOVE_MARKER,
                args: {
                    from: prevState.markedKey,
                    to: nextState.markedKey,
                },
            });
        }

        if (prevState.markerVisibility !== nextState.markerVisibility) {
            changes.push({
                name: ListChangeNameEnum.CHANGE_MARKER_VISIBILITY,
                args: {
                    visibility: nextState.markerVisibility,
                },
            });
            if (nextState.markerVisibility === 'hidden') {
                changes.push({
                    name: ListChangeNameEnum.MOVE_MARKER,
                    args: {
                        from: prevState.markedKey,
                        to: null,
                    },
                });
            }
        }
        return changes;
    }

    getNextState(state: IMarkerState, changes: IListChange[]): IMarkerState {
        const nextState = copyMarkerState(state);

        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.CHANGE_MARKER_VISIBILITY: {
                    nextState.markerVisibility = change.args.visibility;
                    break;
                }
                case ListChangeNameEnum.MOVE_MARKER: {
                    nextState.markedKey = change.args.to;
                    break;
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.MOVE_MARKER: {
                    // TODO: Можно убирать из контракта избыточный from.
                    const { to } = change.args;
                    collection.setMarkedKey(to);
                    break;
                }
            }
        }
    }

    // TODO: Надо совещание, услышать мнение, это про групповые изменения.
    // TODO: appendChange, prependChange
    static resolveChangesOnItemsChange(
        prevState: IMarkerState,
        nextState: IMarkerState,
        itemsChanges: TItemsChanges[]
    ): IMoveMarkerListChange[] {
        const markerChanges: IMoveMarkerListChange[] = [];

        const { isRemoved, handledChange } = checkIsMarkedItemRemoved(prevState, itemsChanges);

        if (isRemoved && handledChange) {
            markerChanges.push(
                {
                    name: ListChangeNameEnum.MOVE_MARKER,
                    args: {
                        from: prevState.markedKey,
                        to: undefined,
                    },
                },
                {
                    name: ListChangeNameEnum.MOVE_MARKER,
                    args: {
                        from: undefined,
                        to: calculateNearbyItemKey(
                            prevState,
                            prevState.collection,
                            handledChange.args.index
                        ),
                    },
                }
            );
        } else if (isMarkerPreviouslyDoesntExist(itemsChanges, prevState, nextState)) {
            markerChanges.push({
                name: ListChangeNameEnum.MOVE_MARKER,
                args: {
                    from: prevState.markedKey,
                    to: nextState.collection.getFirst('Markable')?.key,
                },
            });
        }

        return markerChanges;
    }

    initMarker<TCollection extends ICollection>(
        state: IMarkerState,
        collection: TCollection
    ): CrudEntityKey {
        if (state.markerVisibility === 'hidden') {
            return undefined;
        }

        let newMarkedKey = state.markedKey;

        if (
            state.markerVisibility === 'visible' ||
            (state.markerVisibility === 'onactivated' && state.markedKey !== undefined)
        ) {
            const item = collection.getItemBySourceKey(state.markedKey, false);
            if (state.markerVisibility === 'visible' && collection.getCount() && !item) {
                newMarkedKey = collection.getFirst('Markable')?.key as CrudEntityKey;
            }
        }

        return newMarkedKey;
    }

    setMarker(state: IMarkerState, key: CrudEntityKey): IMarkerState {
        const nextState = copyMarkerState(state);

        if (nextState.markerVisibility !== 'hidden') {
            nextState.markedKey = key;
        }
        return nextState;
    }

    calculateMarkedKeyForVisible<TCollection extends ICollection>(
        state: IMarkerState,
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
}

export function markerStateManagerFactory(): MarkerStateManager {
    return new MarkerStateManager();
}