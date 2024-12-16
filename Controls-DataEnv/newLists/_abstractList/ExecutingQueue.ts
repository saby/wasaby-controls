import { AbstractListActionCreators, TAbstractListActions } from './actions';

export default class ExecutingQueue {
    private _executingActions?: TAbstractListActions.TAnyAbstractAction[];

    scheduleExecution<T extends TAbstractListActions.TAnyAbstractAction>(
        actions: T[],
        action: T
    ): T[] {
        return this._scheduleExecution(actions, action);
    }

    startExecution(actions: TAbstractListActions.TAnyAbstractAction[]) {
        this._executingActions = actions;
    }

    getExecuting(): TAbstractListActions.TAnyAbstractAction[] | never {
        if (!this._executingActions) {
            // TODO: ошибку.
            throw Error();
        }
        return this._executingActions;
    }

    endExecution() {
        this._executingActions = undefined;
    }

    private _scheduleExecution<TAction extends TAbstractListActions.TAnyAbstractAction>(
        alreadyScheduled: TAction[],
        actionToSchedule: TAction
    ) {
        const newScheduled = !this._executingActions
            ? [...alreadyScheduled]
            : alreadyScheduled.filter((queuedAction) => {
                  // исключаем те, что сейчас исполняются
                  return !(
                      this._executingActions as Required<typeof this._executingActions>
                  ).includes(queuedAction);
              });

        let newAction: undefined | TAction = actionToSchedule;

        // Тут можно пропускать добавляемое действие и очередь через функции.
        // Оптимизировать добавление и т.п.
        newAction = prepareSiblingSetState(newScheduled, newAction);
        newAction = filterUselessSetState(newScheduled, newAction);

        if (newAction) {
            newScheduled.push(newAction);
        }

        return newScheduled;
    }
}

function prepareSiblingSetState<TAction extends TAbstractListActions.TAnyAbstractAction>(
    newScheduled: TAction[],
    newAction: TAction
) {
    const lastQueuedAction = newScheduled[newScheduled.length - 1];
    // Если последний добавленный экшен и новый это publicSetState с объектом (не колбэком)
    // то объекты надо схлопнуть
    if (
        newAction.type === 'publicSetState' &&
        typeof newAction.payload.nextState !== 'function' &&
        lastQueuedAction &&
        lastQueuedAction.type === 'publicSetState' &&
        typeof lastQueuedAction.payload.nextState !== 'function'
    ) {
        newScheduled.pop();
        return AbstractListActionCreators.complexUpdate.publicSetState({
            ...lastQueuedAction.payload.nextState,
            ...newAction.payload.nextState,
        }) as TAction;
    }

    return newAction;
}

function filterUselessSetState<TAction extends TAbstractListActions.TAnyAbstractAction>(
    _newScheduled: TAction[],
    newAction: TAction
) {
    return newAction;
}
