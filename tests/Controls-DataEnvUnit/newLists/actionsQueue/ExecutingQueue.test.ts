import ExecutingQueue from 'Controls-DataEnv/newLists/_abstractList/ExecutingQueue';
import * as ErrorDescriptors from 'Controls-DataEnv/newLists/_abstractList/ErrorDescriptors';
import { ListWebActions } from 'Controls/dataFactory';

import type { IAbstractListState } from 'Controls-DataEnv/abstractList';

describe('Controls-DataEnv/newLists/_abstractList/ExecutingQueue:ExecutingQueue', () => {
    let executingQueue: ExecutingQueue;
    beforeEach(() => {
        executingQueue = new ExecutingQueue();
    });
    it('Добавление нового экшена отправляет его в конец запланированных к исполнению экшенов', () => {
        const actions = [
            ListWebActions.interactorCore.publicSetState({}),
            ListWebActions.interactorCore.publicSetState({}),
        ];
        actions.forEach((action) => executingQueue.addAction(action));
        executingQueue.startExecution();
        expect(executingQueue.getExecuting()).toEqual(actions);
    });
    it('Выполнение экшенов переводит их из очереди запланированных в очередь исполняемых экшенов', () => {
        const actions = [
            ListWebActions.interactorCore.publicSetState({}),
            ListWebActions.interactorCore.publicSetState({}),
        ];
        actions.forEach((action) => executingQueue.addAction(action));
        executingQueue.startExecution();
        expect(executingQueue.getExecuting()).toEqual(actions);
    });
    it('Подготовка запланированных к исполнению экшенов сливает смежные объектные setState', () => {
        const actions = [
            ListWebActions.interactorCore.publicSetState({ markedKey: 'value1' }),
            ListWebActions.interactorCore.publicSetState({ markedKey: 'value2' }),
            ListWebActions.interactorCore.publicSetState(() => ({})),
            ListWebActions.interactorCore.publicSetState({ markedKey: 'value3' }),
            ListWebActions.interactorCore.publicSetState({ markedKey: 'value4' }),
        ];
        actions.forEach((action) => executingQueue.addAction(action));
        const preparedActions = executingQueue.prepareForExecution({} as IAbstractListState);
        expect(preparedActions?.length).toBe(3);
    });
    it('Отмена исполнения экшенов выбрасывает ошибку, когда нет исполняемых экшенов', () => {
        const mockedErrorCallback = jest.spyOn(
            ErrorDescriptors,
            'EMPTY_EXECUTING_ACTIONS_ON_REJECT'
        );
        mockedErrorCallback.mockImplementationOnce(() => {});
        executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
        executingQueue.rejectExecutingIfNeed(() => true);
        expect(mockedErrorCallback.mock.calls.length).toBe(1);
        mockedErrorCallback.mockRestore();
    });
    describe('Отмена исполнения экшенов происходит, если последний добавленный экшен должен отменить исполнение', () => {
        beforeEach(() => {
            executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
            executingQueue.startExecution();
        });
        it('changeRoot', () => {
            executingQueue.addAction(ListWebActions.root.changeRoot(1));
            expect(executingQueue.rejectExecutingIfNeed(() => false)).toBeTruthy();
        });
        it('changeFilter', () => {
            executingQueue.addAction(ListWebActions.filter.setFilter({}));
            expect(executingQueue.rejectExecutingIfNeed(() => false)).toBeTruthy();
        });
        it('search', () => {
            executingQueue.addAction(ListWebActions.search.startSearch('value'));
            expect(executingQueue.rejectExecutingIfNeed(() => false)).toBeTruthy();
        });
        it('resetSearch', () => {
            executingQueue.addAction(ListWebActions.search.resetSearch());
            expect(executingQueue.rejectExecutingIfNeed(() => false)).toBeTruthy();
        });
    });
    it('При отмене все исполняемые экшены заново планируются', () => {
        const actions = [
            ListWebActions.interactorCore.publicSetState({ markedKey: 'executing' }),
            ListWebActions.interactorCore.publicSetState({ root: 'reject' }),
        ];
        executingQueue.addAction(actions[0]);
        executingQueue.startExecution();
        executingQueue.addAction(actions[1]);
        expect(executingQueue.rejectExecutingIfNeed(() => true)).toBeTruthy();
        executingQueue.startExecution();
        expect(executingQueue.getExecuting()).toEqual(actions);
    });
    it('Отмена исполнения экшенов происходит, если был добавлен объектный setState, проходящий по условиям needRejectBeforeApplyState', () => {
        executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
        executingQueue.startExecution();
        executingQueue.addAction(
            ListWebActions.interactorCore.publicSetState({ markedKey: 'value' })
        );
        const needRejectBeforeApplyState = (partialState: Partial<IAbstractListState>): boolean => {
            return partialState.markedKey === 'value';
        };
        expect(executingQueue.rejectExecutingIfNeed(needRejectBeforeApplyState)).toBeTruthy();
    });
    it('Функция отмены возвращает true, если отмена произошла и false, если отмены не было', () => {
        executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
        executingQueue.startExecution();
        executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
        expect(executingQueue.rejectExecutingIfNeed(() => false)).toBeFalsy();
        executingQueue.startExecution();
        executingQueue.addAction(ListWebActions.interactorCore.publicSetState({}));
        expect(executingQueue.rejectExecutingIfNeed(() => true)).toBeTruthy();
    });
});
