import {
    IListState,
    ListActionCreators,
    TListActions,
    operationsPanelMiddleware,
    TListMiddleware,
    _privateForOldCode_SnapshotsStore as SnapshotsStore,
} from 'Controls-DataEnv/list';

const {
    operationsPanel: operationsPanelActions,
    selection: selectionActions,
    marker: markerActions,
} = ListActionCreators;

describe('Controls-DataEnv/list:operationsPanelMiddleware', () => {
    describe('openOperationsPanel', () => {
        it('should reduce state', async () => {
            const { state, middleware } = getMiddleware();
            await middleware(operationsPanelActions.openOperationsPanel());

            expect(state.current.operationsPanelVisible).toBe(true);
        });

        it('do nothing is already opened', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware();
            await middleware(operationsPanelActions.openOperationsPanel());
            expect(state.current.operationsPanelVisible).toBe(true);

            const count = dispatchedActions.length;
            await middleware(operationsPanelActions.openOperationsPanel());
            expect(dispatchedActions.length).toBe(count);
        });

        describe('check sub actions', () => {
            it('should init show selection', async () => {
                const { middleware, dispatchedActions } = getMiddleware();
                await middleware(operationsPanelActions.openOperationsPanel());

                const action = dispatchedActions.find(
                    (action) =>
                        action.type === selectionActions.setSelectionVisibility('visible').type
                ) as TListActions.selection.TSetSelectionVisibilityAction | undefined;

                expect(action).toBeTruthy();
                expect(action?.payload.visibility).toBe('visible');
            });

            it('should init activate marker', async () => {
                const { middleware, dispatchedActions } = getMiddleware();
                await middleware(operationsPanelActions.openOperationsPanel());

                const action = dispatchedActions.find(
                    (action) => action.type === markerActions.activateMarker().type
                ) as TListActions.marker.TActivateMarkerAction | undefined;

                expect(action).toBeTruthy();
            });
        });
    });

    describe('closeOperationsPanel', () => {
        it('should reduce state', async () => {
            const { state, middleware } = getMiddleware();

            state.current.operationsPanelVisible = true;
            await middleware(operationsPanelActions.closeOperationsPanel());

            expect(state.current.operationsPanelVisible).toBe(false);
        });

        it('do nothing is already closed', async () => {
            const { state, middleware, dispatchedActions } = getMiddleware();
            state.current.operationsPanelVisible = true;
            await middleware(operationsPanelActions.closeOperationsPanel());

            const count = dispatchedActions.length;
            await middleware(operationsPanelActions.closeOperationsPanel());
            expect(dispatchedActions.length).toBe(count);
        });

        describe('check sub actions', () => {
            it('should init resetSelection', async () => {
                const { state, middleware, dispatchedActions } = getMiddleware();
                state.current.operationsPanelVisible = true;
                await middleware(operationsPanelActions.closeOperationsPanel());

                const action = dispatchedActions.find(
                    (action) => action.type === selectionActions.resetSelection().type
                ) as TListActions.selection.TResetSelectionAction | undefined;

                expect(action).toBeTruthy();
            });

            it('should init resetSelectionViewMode', async () => {
                const { state, middleware, dispatchedActions } = getMiddleware();
                state.current.operationsPanelVisible = true;
                await middleware(operationsPanelActions.closeOperationsPanel());

                const action = dispatchedActions.find(
                    (action) => action.type === operationsPanelActions.resetSelectionViewMode().type
                ) as TListActions.operationsPanel.TResetSelectionViewModeAction | undefined;

                expect(action).toBeTruthy();
            });
        });
    });
});

const getMiddleware = (): {
    state: {
        current: IListState;
    };
    middleware: ReturnType<ReturnType<TListMiddleware>>;
    nextActions: TListActions.TAnyListAction[];
    dispatchedActions: TListActions.TAnyListAction[];
} => {
    const state = {
        current: {} as IListState,
    };

    const dispatchedActions: TListActions.TAnyListAction[] = [];

    const nextActions: TListActions.TAnyListAction[] = [];
    const next = (a: TListActions.TAnyListAction) => {
        nextActions.push(a);
    };

    const middleware = operationsPanelMiddleware({
        dispatch: async (action) => {
            dispatchedActions.push(action);
        },
        getState: () => state.current,
        snapshots: new SnapshotsStore(),
        applyState: (s) => {
            state.current = {
                ...state.current,
                ...s,
            };
        },
        setState: (s) => {
            state.current = {
                ...state.current,
                ...s,
            };
        },
    })(next);

    return {
        state,
        middleware,
        nextActions,
        dispatchedActions,
    };
};
