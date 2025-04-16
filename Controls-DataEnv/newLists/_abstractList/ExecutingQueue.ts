import { default as AbstractListActionCreators, TAbstractListActions } from './actions';
import type { IAbstractListState } from './interface/IAbstractListState';
import { PublicSetStateSymbol } from './actions/types/_interactorCore';
import { isFunction, isObject } from './validators/predicates';
import getError from './utils/getError';

type TNeedRejectBeforeApplyState<TState extends IAbstractListState> = (
    state: Partial<TState>,
    currentAppliedState?: Partial<TState>
) => boolean;

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
    private initSliceUpdateToken: symbol = Symbol('initSliceUpdateToken');

    /**
     * Метод для добавления экшена в очередь
     */
    addAction(action: TAbstractListActions.TAnyAbstractListAction): symbol {
        this._actionsQueue = (this._actionsQueue || []).concat(action);
        return this.initSliceUpdateToken;
    }

    /**
     * Метод для проверки токена обновления слайса
     */
    checkUpdateToken(partialState?: unknown): boolean {
        return (
            hasUpdateTokenProperty(partialState) &&
            partialState._updateToken === this.initSliceUpdateToken
        );
    }

    /**
     * Метод старта выполнения экшенов
     */
    startExecution() {
        this._executingActions = this._actionsQueue;
        this._actionsQueue = undefined;
    }

    /**
     * Метод для получения текущих исполняемых экшенов
     */
    getExecuting(): TAbstractListActions.TAnyAbstractListAction[] {
        return this._executingActions || [];
    }

    /**
     * Метод для определения выполняются ли сейчас экшены
     */
    isExecuting(): boolean {
        return !!this.getExecuting().length;
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

        const actionFilter = new ActionFilter();
        this._actionsQueue = this._actionsQueue.filter((action) =>
            actionFilter.isRelevant(action, state)
        );
        this._actionsQueue = prepareSiblingSetState(this._actionsQueue);

        return this._actionsQueue as TAbstractListActions.TAnyAbstractListAction<TState>[];
    }

    /**
     * Метод для отмены текущих исполняемых экшенов
     */
    rejectExecutingIfNeed<TState extends IAbstractListState>(
        needRejectBeforeApply: TNeedRejectBeforeApplyState<TState>
    ): boolean {
        if (this._needReject(needRejectBeforeApply)) {
            this._reScheduleExecutingActions();
            return true;
        }
        return false;
    }

    /**
     * Метод для определения небходимости отмены исполнения экшенов по последнему запланированному экшену
     */
    _needReject<TState extends IAbstractListState>(
        needRejectBeforeApply: TNeedRejectBeforeApplyState<TState>
    ): boolean {
        if (!this._actionsQueue) {
            return false;
        }
        const lastAddedAction = this._actionsQueue[this._actionsQueue.length - 1];

        if (isObjectSetState(lastAddedAction)) {
            // Если это объектный setState, то необходимо передать решение слайсовому методу needRejectBeforeApply

            const executingActions = this.getExecuting();
            if (!executingActions.length) {
                // Ошибка упадет асинхронно.
                getError('EMPTY_EXECUTING_ACTIONS_ON_REJECT');
                return false;
            }
            const lastExecutingAction = executingActions[executingActions.length - 1];

            return needRejectBeforeApply(
                lastAddedAction.payload.nextState as TState,
                isObjectSetState(lastExecutingAction)
                    ? (lastExecutingAction.payload.nextState as Partial<TState>)
                    : undefined
            );
        } else if (
            // true если тип экшена соответствует одному из ниже представленных
            ['setFilter', 'resetSearch', 'startSearch', 'changeRoot'].some(
                (rejectType) => rejectType === lastAddedAction.type
            )
        ) {
            return true;
        }
        return false;
    }

    /**
     * Метод для повторного планирования исполняемых экшенов
     */
    _reScheduleExecutingActions(): void {
        const scheduled = this._actionsQueue || [];
        this._actionsQueue = undefined;
        this.getExecuting().forEach(this.addAction.bind(this));
        scheduled.forEach(this.addAction.bind(this));
    }
}
function hasUpdateTokenProperty(state: unknown): state is { _updateToken: unknown } {
    return isObject(state) && state.hasOwnProperty('_updateToken');
}
function isObjectSetState<TState = IAbstractListState>(
    action: unknown
): action is { type: typeof PublicSetStateSymbol; payload: { nextState: TState } } {
    if (!(isObject(action) && (action as { type: unknown }).type === PublicSetStateSymbol)) {
        return false;
    }

    const payload = (action as { payload: unknown }).payload;

    return isObject(payload) && !isFunction((payload as { nextState: unknown }).nextState);
}

/**
 * Класс фильтра, позволяющий определить экшены, которые не внесут изменений в состояние при применении
 */
export class ActionFilter<
    TState extends IAbstractListState = IAbstractListState,
    TAction extends
        TAbstractListActions.TAnyAbstractListAction<TState> = TAbstractListActions.TAnyAbstractListAction<TState>,
> {
    /**
     * Флаг указывающий на то, что экшен считается актуальным без проверки
     */
    private _skip: boolean;

    /**
     * Определяет, внесет ли экшен изменения в новое состояние
     */
    isRelevant(action: TAction, state: TState): boolean {
        if (this._skip || this._isRelevantAction(state, action)) {
            // если есть хотя бы один экшен, который внесет изменение в состояние,
            // тогда все экшены после него могут внести изменение и потому автоматически считаются актуальными.
            this._skip = true;
            return true;
        }
        return false;
    }

    /**
     * Указывает на актуальность переданного экшена.
     * Возвращает false в том случае, если переданный экшен не внесет изменений в состояние
     */
    private _isRelevantAction(state: TState, action: TAction): boolean {
        switch (action.type) {
            case 'changeRoot':
                return action.payload.root !== state.root;
            case PublicSetStateSymbol:
                return this._isRelevantObjectSetState(state, action);
            default:
                return true;
        }
    }

    /**
     * Указывает на актуальность экшена объектного setState.
     * Возвращает false лишь в том случае, если переданный экшен является объектным setState и его состояние уже установлено
     */
    private _isRelevantObjectSetState(state: TState, action: TAction): boolean {
        return !(
            isObjectSetState<TState>(action) && isObjectStatesEqual(action.payload.nextState, state)
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
            isObjectSetState<TState>(action) &&
            isObjectSetState<TState>(lastQueuedAction)
        ) {
            queue.pop();
            queue.push(
                AbstractListActionCreators.interactorCore.publicSetState({
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
 * Определяет есть ли различия в опциях переданных состояний
 */
function isObjectStatesEqual<TState extends IAbstractListState>(
    partialState: Partial<TState>,
    original: TState
) {
    return (Object.keys(partialState) as (keyof TState)[]).every((key) => {
        return original[key] === partialState[key];
    });
}
