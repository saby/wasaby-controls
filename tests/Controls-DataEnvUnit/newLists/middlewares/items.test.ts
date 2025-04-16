import { itemsMiddleware } from 'Controls-DataEnv/list';
import {
    AbstractListActionCreators,
    ChangeAction,
    IAbstractListState,
    Initializer,
    TAbstractListActions,
    TAbstractListMiddleware,
} from 'Controls-DataEnv/abstractList';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { clone } from 'Types/object';
import type { CrudEntityKey } from 'Types/source';
import type { Collection } from 'Controls/display';

const { items: itemsActions } = AbstractListActionCreators;

describe('Controls/listWebReducers:items', () => {
    it('keyProperty has changed', async () => {
        const { state, middleware } = getMiddleware({
            keyProperty: 'key',
        });

        await middleware(itemsActions.changeKeyProperty('id'));

        expect(state.current.keyProperty).toBe('id');
    });

    describe('items operations', () => {
        it('replace all items', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const newItems = createRecordSet(8);

            await middleware(itemsActions.replaceAllItems(newItems));

            expect(state.current.items?.getCount()).toBe(8);

            const action = getDispatchedActionByType('onAllItemsReplaced', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('replace first item', async () => {
            const { state, middleware } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const newItems = [
                new Model({ rawData: { key: 0, title: 'newTitle0' }, keyProperty: 'key' }),
            ];

            await middleware(
                itemsActions.replaceItems(
                    new Map(newItems.map((item: Model, index: number) => [index, item])),
                    'EXTERNAL'
                )
            );

            expect(state.current.items?.getCount()).toBe(10);
            expect(state.current.items?.getRecordById(0).get('title')).toBe('newTitle0');
        });

        it('remove items', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            await middleware(itemsActions.removeItems([0, 5], 0, 'EXTERNAL'));

            expect(state.current.items?.getCount()).toBe(8);
            expect(state.current.items?.getRecordById(5)).not.toBeDefined();

            const action = getDispatchedActionByType('onItemsRemoved', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('prepend items', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const newItems = [
                new Model({ rawData: { key: 0, title: 'newTitle0' }, keyProperty: 'key' }),
                new Model({
                    rawData: {
                        key: 11,
                        title: 'newTitle11',
                    },
                    keyProperty: 'key',
                }),
            ];

            const addedItemsMap = new Map<CrudEntityKey | undefined, Model>();
            let appendKey: CrudEntityKey | undefined;

            for (const newItem of newItems) {
                addedItemsMap.set(appendKey, newItem);
                appendKey = newItem.getKey();
            }

            await middleware(itemsActions.prependItems(addedItemsMap, 'EXTERNAL'));

            expect(state.current.items?.getCount()).toBe(12);
            expect(state.current.items?.at(0).get('title')).toBe('newTitle11');
            expect(state.current.items?.at(1).get('title')).toBe('newTitle0');

            const action = getDispatchedActionByType('onItemsAdded', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('append items', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const newItems = [
                new Model({ rawData: { key: 11, title: 'newTitle11' }, keyProperty: 'key' }),
                new Model({
                    rawData: {
                        key: 12,
                        title: 'newTitle12',
                    },
                    keyProperty: 'key',
                }),
            ];

            const addedItemsMap = new Map<CrudEntityKey | undefined, Model>();
            let appendKey: CrudEntityKey = 10;

            for (const newItem of newItems) {
                addedItemsMap.set(appendKey, newItem);
                appendKey = newItem.getKey();
            }

            await middleware(itemsActions.appendItems(addedItemsMap, 'EXTERNAL'));

            expect(state.current.items?.getCount()).toBe(12);
            expect(state.current.items?.at(10).get('title')).toBe('newTitle11');
            expect(state.current.items?.at(11).get('title')).toBe('newTitle12');

            const action = getDispatchedActionByType('onItemsAdded', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('reset items', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const oldItems: Model[] = [];

            state.current.items?.each((item) => oldItems.push(item));

            const newItems = clone(oldItems);
            newItems.forEach((item, index) => item.set('title', 'newTitle' + index));

            await middleware(itemsActions.resetItems(newItems, oldItems, 0, 'EXTERNAL'));

            expect(state.current.items?.getCount()).toBe(10);
            expect(state.current.items?.at(0).get('title')).toBe('newTitle0');
            expect(state.current.items?.at(1).get('title')).toBe('newTitle1');

            const action = getDispatchedActionByType('onItemsReset', dispatchedActions);

            expect(action).toBeTruthy();
        });
    });

    describe('actions', () => {
        it('trigger add action', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const newItems = [
                new Model({ rawData: { key: 11, title: 'newTitle0' }, keyProperty: 'key' }),
            ];

            await middleware(
                itemsActions.setItemsChanges([
                    {
                        newItems,
                        removedItems: [],
                        action: ChangeAction.ACTION_ADD,
                        changeSource: 'EXTERNAL',
                        newItemsIndex: state.current.items?.getCount() ?? 0,
                        removedItemsIndex: 0,
                        reason: 'assign',
                    },
                ])
            );

            const action = getDispatchedActionByType('appendItems', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('trigger remove action', async () => {
            const { middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const removedItems = [
                new Model({ rawData: { key: 0, title: 'i0' }, keyProperty: 'key' }),
            ];

            await middleware(
                itemsActions.setItemsChanges([
                    {
                        newItems: [],
                        removedItems,
                        action: ChangeAction.ACTION_REMOVE,
                        changeSource: 'EXTERNAL',
                        newItemsIndex: 0,
                        removedItemsIndex: 0,
                    },
                ])
            );

            const action = getDispatchedActionByType('removeItems', dispatchedActions);

            expect(action).toBeTruthy();
        });

        it('trigger reset action', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware({
                items: createRecordSet(),
                keyProperty: 'key',
            });

            const oldItems: Model[] = [];

            state.current.items?.each((item) => oldItems.push(item));

            const newItems = clone(oldItems);
            newItems.forEach((item, index) => item.set('title', 'newTitle' + index));

            await middleware(
                itemsActions.setItemsChanges([
                    {
                        newItems,
                        removedItems: oldItems,
                        action: ChangeAction.ACTION_RESET,
                        changeSource: 'EXTERNAL',
                        newItemsIndex: 0,
                        removedItemsIndex: 0,
                        reason: 'assign',
                    },
                ])
            );

            const action = getDispatchedActionByType('resetItems', dispatchedActions);

            expect(action).toBeTruthy();
        });
    });
});

function getMiddleware(initState: Partial<IAbstractListState> = {}): {
    state: {
        current: IAbstractListState;
    };
    middleware: ReturnType<ReturnType<TAbstractListMiddleware>>;
    nextActions: TAbstractListActions.TAnyAbstractListAction[];
    dispatchedActions: TAbstractListActions.TAnyAbstractListAction[];
} {
    const state: {
        current: IAbstractListState;
    } = {
        current: {
            ...Initializer.getState(
                {
                    isLatestInteractorVersion: false,
                    ...initState,
                },
                { ...initState }
            ),
            ...initState,
        },
    };

    const dispatchedActions: TAbstractListActions.TAnyAbstractListAction[] = [];

    const nextActions: TAbstractListActions.TAnyAbstractListAction[] = [];
    const next = (a: TAbstractListActions.TAnyAbstractListAction) => {
        nextActions.push(a);
    };

    const middleware = itemsMiddleware({
        dispatch: async (action: TAbstractListActions.TAnyAbstractListAction) => {
            dispatchedActions.push(action);
        },
        getState: () => state.current,
        applyState: (s: Partial<IAbstractListState>) => {
            state.current = {
                ...state.current,
                ...s,
            };
        },
        setState: (s: Partial<IAbstractListState>) => {
            state.current = {
                ...state.current,
                ...s,
            };
        },
        registerPendingPromise: <T>(_: string, promise: Promise<T>) => promise,
        getSkipSetCollection: () => false,
        scheduleDispatch(_action: TAbstractListActions.TAnyAbstractListAction) {
            throw Error('Controls-DataEnv/list:itemsMiddleware should not use scheduleDispatch.');
        },
        getCollection: (): Collection | undefined => undefined,
    })(next);

    return {
        state,
        middleware,
        nextActions,
        dispatchedActions,
    };
}

function createRecordSet(count: number = 10): RecordSet {
    return new RecordSet({
        rawData: Array.from({ length: count }).map((_, index) => ({
            key: index,
            title: 'i' + index,
        })),
        keyProperty: 'key',
    });
}

function getDispatchedActionByType<
    TActions extends TAbstractListActions.TAnyAbstractListAction[],
    TAction extends TActions[number],
    TActionType extends TAction['type'],
>(
    actionType: TActionType,
    dispatchedActions: TActions
):
    | Extract<
          TAction,
          {
              type: TActionType;
          }
      >
    | undefined {
    return dispatchedActions.find(({ type }) => type === actionType) as
        | Extract<
              TAction,
              {
                  type: TActionType;
              }
          >
        | undefined;
}
