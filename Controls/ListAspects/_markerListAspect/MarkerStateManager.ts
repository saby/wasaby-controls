import type { CrudEntityKey } from 'Types/source';
import type { Collection as ICollection } from 'Controls/display';
import {
    ListChangeNameEnum,
    AbstractAspectStateManager,
    IListChange,
    IMoveMarkerListChange,
} from 'Controls/abstractListAspect';
import {
    IAppendItemsChange,
    IPrependItemsChange,
    IRemoveItemsChange,
    TItemsChanges,
} from 'Controls/itemsListAspect';
import { copyMarkerState, IMarkerState } from './IMarkerState';
import { getMarkerStrategy } from './UILogic/getMarkerStrategy';

function calculateNearbyItemKey<TCollection extends ICollection>(
    state: IMarkerState,
    collection: TCollection,
    index: number
): CrudEntityKey | null {
    const strategy = getMarkerStrategy(collection, {
        // TODO реализовать moveMarkerOnScrollPaging.
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
        return changes;
    }

    getNextState(state: IMarkerState, changes: IListChange[]): IMarkerState {
        const nextState = copyMarkerState(state);

        for (const change of changes) {
            switch (change.name) {
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
                }
            }
        }
    }

    // TODO: Надо совещание, услышать мнение, это про групповые изменения.
    // TODO: appendChange, prependChange
    static resolveChangesOnItemsChange(
        prevState: IMarkerState,
        _nextState: IMarkerState,
        itemsChanges: TItemsChanges[]
    ): IMoveMarkerListChange[] {
        const markerChanges: IMoveMarkerListChange[] = [];

        const removeChange = itemsChanges.find(
            (c) => c.name === ListChangeNameEnum.REMOVE_ITEMS
        ) as IRemoveItemsChange | undefined;
        const appendChange = itemsChanges.find(
            (c) => c.name === ListChangeNameEnum.APPEND_ITEMS
        ) as IAppendItemsChange | undefined;
        const prependChange = itemsChanges.find(
            (c) => c.name === ListChangeNameEnum.PREPEND_ITEMS
        ) as IPrependItemsChange | undefined;

        if (removeChange && (appendChange || prependChange)) {
            // TODO: Что такое null, нужно разобраться и убрать это.
            if (
                typeof prevState.markedKey !== 'undefined' &&
                prevState.markedKey !== null &&
                removeChange.args.keys.includes(prevState.markedKey) &&
                !(appendChange || prependChange)?.args.items.has(prevState.markedKey)
            ) {
                // TODO: Что такое null, нужно разобраться и убрать это.
                // TODO: Что делать с коллекцией, вероятно надо отдирать отсюда.
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
                                removeChange.args.index
                            ),
                        },
                    }
                );
            }
        } else if (removeChange) {
            // TODO: Что такое null, нужно разобраться и убрать это.
            if (
                typeof prevState.markedKey !== 'undefined' &&
                prevState.markedKey !== null &&
                removeChange.args.keys.includes(prevState.markedKey)
            ) {
                // TODO: Что такое null, нужно разобраться и убрать это.
                // TODO: Что делать с коллекцией, вероятно надо отдирать отсюда.
                markerChanges.push({
                    name: ListChangeNameEnum.MOVE_MARKER,
                    args: {
                        from: prevState.markedKey,
                        to: calculateNearbyItemKey(
                            prevState,
                            prevState.collection,
                            removeChange.args.index
                        ),
                    },
                });
            }
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
            const item = collection.getItemBySourceKey(state.markedKey);
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
