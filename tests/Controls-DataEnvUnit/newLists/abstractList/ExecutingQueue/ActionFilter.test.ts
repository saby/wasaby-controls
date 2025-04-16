import {
    AbstractListActionCreators,
    IAbstractListState,
    TAbstractListActions,
} from 'Controls-DataEnv/abstractList';
import { ActionFilter } from 'Controls-DataEnv/newLists/_abstractList/ExecutingQueue';

describe('Controls-DataEnv/newLists/_abstractList/ExecutingQueue:ActionFilter', () => {
    let actionFilter: ActionFilter;
    beforeEach(() => {
        actionFilter = new ActionFilter();
    });
    describe('Объектный setState', () => {
        it('Отсекается, если при применении не внесет изменений в состояние', () => {
            const actions = [
                AbstractListActionCreators.interactorCore.publicSetState({
                    markedKey: 'value',
                }),
            ];
            const state = {
                markedKey: 'value',
            } as IAbstractListState;
            const filteredActions = actions.filter((action) =>
                actionFilter.isRelevant(action, state)
            );
            expect(filteredActions.length).toBe(0);
        });
        it('Остается, если состояние содержит как новое состояние, так и то, что уже установлено', () => {
            const actions = [
                AbstractListActionCreators.interactorCore.publicSetState({
                    markedKey: 'value',
                    searchValue: 'value',
                }),
            ];
            const state = {
                markedKey: 'value',
            } as IAbstractListState;
            const filteredActions = actions.filter((action) =>
                actionFilter.isRelevant(action, state)
            );
            expect(filteredActions.length).toBe(1);
        });
        it('Остается, если содержит только новое состояния', () => {
            const actions = [
                AbstractListActionCreators.interactorCore.publicSetState({
                    markedKey: 'value',
                    searchValue: 'value',
                }),
            ];
            const state = {} as IAbstractListState;
            const filteredActions = actions.filter((action) =>
                actionFilter.isRelevant(action, state)
            );
            expect(filteredActions.length).toBe(1);
        });
    });
    describe('Экшен changeRoot', () => {
        it('Отсекается, если корень уже установлен', () => {
            const actions = [AbstractListActionCreators.root.changeRoot(1)];
            const state = { root: 1 } as IAbstractListState;
            const filteredActions = actions.filter((action) =>
                actionFilter.isRelevant(action, state)
            );
            expect(filteredActions.length).toBe(0);
        });
        it('Остается, если корень еще не установлен', () => {
            const actions = [AbstractListActionCreators.root.changeRoot(1)];
            const state = {} as IAbstractListState;
            const filteredActions = actions.filter((action) =>
                actionFilter.isRelevant(action, state)
            );
            expect(filteredActions.length).toBe(1);
        });
    });
    it('Если в очереди есть экшен, который вносит изменение в состояние при применении, тогда все последующие после него экшены должны так же примениться', () => {
        const actions = [
            {
                type: 'actionType',
                payload: {},
            } as unknown as TAbstractListActions.TAnyAbstractListAction,
            AbstractListActionCreators.root.changeRoot(1),
        ];
        const state = {
            root: 1,
        } as IAbstractListState;
        const filteredActions = actions.filter((action) => actionFilter.isRelevant(action, state));
        expect(filteredActions.length).toBe(2);
    });
});
