import { IListState } from 'Controls/dataFactory';
import { operationsPanel } from 'Controls/_dataFactory/ListWebDispatcher/middlewares/operationsPanel';
import * as operationsPanelActions from 'Controls/_dataFactory/ListWebDispatcher/actions/operationsPanel';
import * as selectionActions from 'Controls/_dataFactory/ListWebDispatcher/actions/selection';
import * as markerActions from 'Controls/_dataFactory/ListWebDispatcher/actions/marker';
import { SnapshotsStore } from 'Controls/_dataFactory/ListWebDispatcher/SnapshotsStore';
import { TAbstractDispatch } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractDispatch';
import { TAbstractMiddleware } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractMiddleware';
import { TListAction } from 'Controls/_dataFactory/ListWebDispatcher/types/TListAction';

describe('ListWebDispatcher/middlewares/operationsPanel', () => {
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
                ) as selectionActions.TSetSelectionVisibilityAction | undefined;

                expect(action).toBeTruthy();
                expect(action?.payload.visibility).toBe('visible');
            });

            it('should init activate marker', async () => {
                const { middleware, dispatchedActions } = getMiddleware();
                await middleware(operationsPanelActions.openOperationsPanel());

                const action = dispatchedActions.find(
                    (action) => action.type === markerActions.activateMarker().type
                ) as markerActions.TActivateMarkerAction | undefined;

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
                ) as selectionActions.TResetSelectionAction | undefined;

                expect(action).toBeTruthy();
            });

            it('should init resetSelectionViewMode', async () => {
                const { state, middleware, dispatchedActions } = getMiddleware();
                state.current.operationsPanelVisible = true;
                await middleware(operationsPanelActions.closeOperationsPanel());

                const action = dispatchedActions.find(
                    (action) => action.type === operationsPanelActions.resetSelectionViewMode().type
                ) as operationsPanelActions.TResetSelectionViewModeAction | undefined;

                expect(action).toBeTruthy();
            });
        });
    });
});

const getMiddleware = (): {
    state: {
        current: IListState;
    };
    middleware: ReturnType<TAbstractMiddleware<TListAction>>;
    nextActions: TListAction[];
    dispatchedActions: TListAction[];
} => {
    const state = {
        current: {} as IListState,
    };

    const dispatchedActions: TListAction[] = [];

    const dispatch: TAbstractDispatch<TListAction> = async (action) => {
        if (action.type === 'setState') {
            state.current = {
                ...state.current,
                ...action.payload.state,
            };
        }
        dispatchedActions.push(action);
    };

    const nextActions: TListAction[] = [];
    const next = (a: TListAction) => {
        nextActions.push(a);
    };

    const middleware = operationsPanel({
        dispatch,
        getState: () => state.current,
        getAspects: () => {
            throw Error();
        },
        getTrashBox: () => {
            throw Error();
        },
        getCollection: () => {
            throw Error();
        },
        originalSliceSetState: () => {
            throw Error();
        },
        snapshots: new SnapshotsStore(),
    })(next);

    return {
        state,
        middleware,
        nextActions,
        dispatchedActions,
    };
};
