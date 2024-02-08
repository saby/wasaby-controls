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
    key: CrudEntityKey
): CrudEntityKey | null {
    const strategy = getMarkerStrategy(collection, {
        // TODO реализовать moveMarkerOnScrollPaging.
        moveMarkerOnScrollPaging: undefined,
    });
    // Считаем ключ следующего элемента
    let newMarkedKey = strategy.getNextMarkedKey(
        copyMarkerState({
            ...state,
            markedKey: key,
        }),
        collection
    );

    // Считаем ключ предыдущего элемента, если следующего нет
    if (newMarkedKey === null) {
        newMarkedKey = strategy.getNextMarkedKey(
            copyMarkerState({
                ...state,
                markedKey: key,
            }),
            collection
        );
    }

    return newMarkedKey;
}

export class MarkerStateManager extends AbstractAspectStateManager<IMarkerState> {
    resolveChanges(prevState: IMarkerState, nextState: IMarkerState): IListChange[] {
        const changes: IListChange[] = [];
        if ('markedKey' in nextState && prevState.markedKey !== nextState.markedKey) {
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
                    const { from, to } = change.args;
                    if (from !== to) {
                        // FIXME По делу подчеркивает, тут нужно разобраться как правильно проверить.
                        const item = collection.getItemBySourceKey(from);
                        if (item) {
                            item.setMarked(false);
                        }
                    }
                    // FIXME По делу подчеркивает, тут нужно разобраться как правильно проверить.
                    const item = collection.getItemBySourceKey(to);
                    if (item) {
                        item.setMarked(true);
                    }
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
                removeChange.args.keys.includes(prevState.markedKey)
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
                                prevState.markedKey
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
                            prevState.markedKey
                        ),
                    },
                });
            }
        }

        return markerChanges;
    }

    setMarker(state: IMarkerState, key: CrudEntityKey): IMarkerState {
        const nextState = copyMarkerState(state);

        if (nextState.markerVisibility !== 'hidden') {
            nextState.markedKey = key;
        }
        return nextState;
    }
}

export function markerStateManagerFactory(): MarkerStateManager {
    return new MarkerStateManager();
}
