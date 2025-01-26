import { AbstractListActionCreators, TAbstractListActions } from './actions';
import type { IAbstractListState } from './interface/IAbstractListState';

export default class ExecutingQueue {
    /**
     * Экшены, которые в данный момент исполняются внутри beforeApplyState
     */
    private _executingActions?: TAbstractListActions.TAnyAbstractListAction[];

    /**
     * Очередь экшенов, запланированных к исполнению
     */
    private _actionsQueue?: TAbstractListActions.TAnyAbstractListAction[];

    /**
     * Токен для инициализации обновления состояния слайса
     */
    private executeActionToken: symbol = Symbol('executeActionToken');

    /**
     * Токен для планирования проверки очереди экшенов
     */
    private scheduleCheckActionsQueueToken: symbol = Symbol('scheduleCheckActionsQueueToken');

    /**
     * Метод для добавления экшена в очередь
     */
    addAction(action: TAbstractListActions.TAnyAbstractListAction): symbol {
        this._actionsQueue = (this._actionsQueue || []).concat(action);
        return this.executeActionToken;
    }

    /**
     * Метод для получения токена на проверку очереди экшенов
     */
    scheduleCheckQueue(): symbol {
        return this.scheduleCheckActionsQueueToken;
    }

    /**
     * Метод для проверки токенов
     */
    checkUpdateToken(token?: symbol): boolean {
        return token === this.executeActionToken || token === this.scheduleCheckActionsQueueToken;
    }

    /**
     * Метод старта выполнения экшенов
     */
    startExecution(actions: TAbstractListActions.TAnyAbstractListAction[]) {
        this._executingActions = actions;
        this._actionsQueue = undefined;
    }

    /**
     * Метод для получения текущих исполняемых экшенов
     */
    getExecuting(): TAbstractListActions.TAnyAbstractListAction[] | undefined {
        return this._executingActions;
    }

    /**
     * Метод завершения выполнения экшенов
     */
    endExecution() {
        this._executingActions = undefined;
    }

    /**
     * Метод для получения очереди экшенов, подготовленной к исполнению
     */
    prepareForExecution<TState extends IAbstractListState>(
        state: TState
    ): TAbstractListActions.TAnyAbstractListAction<TState>[] | undefined {
        if (!this._actionsQueue) {
            return;
        }
        let result = this._actionsQueue as TAbstractListActions.TAnyAbstractListAction<TState>[];
        this._actionsQueue = undefined;
        result = prepareSiblingSetState<
            TState,
            TAbstractListActions.TAnyAbstractListAction<TState>
        >(result);
        return filterUselessSetState<TState, TAbstractListActions.TAnyAbstractListAction<TState>>(
            state,
            result
        );
    }
}

/**
 * Метод для объединения соседних экшенов publicSetState с объектом
 */
function prepareSiblingSetState<
    TState extends IAbstractListState,
    TAction extends TAbstractListActions.TAnyAbstractListAction<TState>,
>(actions: TAction[]): TAction[] {
    return actions.reduce((queue, action) => {
        const lastQueuedAction = queue[queue.length - 1];
        // Если последний добавленный экшен и новый это publicSetState с объектом (не колбэком)
        // то объекты надо схлопнуть
        if (
            lastQueuedAction &&
            action.type === 'publicSetState' &&
            typeof action.payload.nextState !== 'function' &&
            lastQueuedAction.type === 'publicSetState' &&
            typeof lastQueuedAction.payload.nextState !== 'function'
        ) {
            queue.pop();
            queue.push(
                AbstractListActionCreators.complexUpdate.publicSetState({
                    ...lastQueuedAction.payload.nextState,
                    ...action.payload.nextState,
                }) as TAction
            );
        } else {
            queue.push(action);
        }
        return queue;
    }, [] as TAction[]);
}
/**
 * Метод для удаления экшенов publicSetState с объектом состояния, совпадающим с актуальным состоянием слайса
 * Удаление прекращается на первом неудаляемом экшене.
 */
function filterUselessSetState<
    TState extends IAbstractListState,
    TAction extends TAbstractListActions.TAnyAbstractListAction<TState>,
>(state: TState, actions: TAction[]): TAction[] {
    const stateAreEqual = (partialState: TState, original: TState) =>
        (Object.keys(partialState) as (keyof TState)[]).every((key) => {
            return original[key] === partialState[key];
        });
    let isLocked = false;

    return actions.reduce((queue, action) => {
        if (!isLocked && action.type === 'publicSetState') {
            if (
                typeof action.payload.nextState === 'function' ||
                !stateAreEqual(action.payload.nextState as TState, state)
            ) {
                queue.push(action);
                isLocked = true;
            }
        } else {
            if (!isLocked) {
                isLocked = true;
            }
            queue.push(action);
        }
        return queue;
    }, [] as TAction[]);
}
