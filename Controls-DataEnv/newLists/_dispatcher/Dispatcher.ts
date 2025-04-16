import { TAbstractAction } from './types/TAbstractAction';
import {
    TAbstractMiddleware,
    TAbstractMiddlewareWithoutContext,
    TPushActionToNextMiddleware,
} from './types/TAbstractMiddleware';
import {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from './types/TAbstractMiddlewareContext';
import { TApplyStateHook, TDispatcherProps, TGetStateHook } from './types/TDispatcherProps';
import { type Dispatcher as TDispatcherErrorDescriptors } from 'Controls-DataEnv/errorDescriptors';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import type { Debugger } from 'Controls-DataEnv/listDebug';
import { default as AsyncOperationsOrchestrator } from './Orchestrator';
import { logger } from 'Application/Env';

/**
 * Абстрактный класс диспетчера, который позволяет организовать поток действий через набор промежуточных обработчиков.
 *
 * Используется для организации потока управления в приложениях, где каждое действие может иметь свои специфические характеристики.
 *
 * Класс предоставляет методы для инициализации, отправки действий и уничтожения диспетчера.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действий для распространения.
 * * `TPayload` - тип промежуточных обработчиков.
 */
export class Dispatcher<
    TState extends object,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> {
    private _debugger?: Debugger;

    /**
     * Утилита для отслеживания незавершенных Promise.
     * @private
     */
    private readonly _asyncOperationsOrchestrator: AsyncOperationsOrchestrator;

    private _middlewares: TAbstractMiddlewareWithoutContext<TAction>[];

    private readonly _getState: TGetStateHook<TState>;
    private readonly _applyState: TApplyStateHook<TState>;

    private state: { current?: TState } = { current: undefined };

    private _dispatchingInfo?: {
        isRejected: boolean;
        action: TAction;
        promise: Promise<void>;
    };

    private _isDestroyed: boolean = false;

    constructor({
        debuggerInstance,
        middlewares,
        getState,
        applyState,
        middlewareContextGetter,
        _disableAsyncValidation,
    }: TDispatcherProps<TState, TAction, TMiddlewareContext>) {
        this._debugger = debuggerInstance;

        this._asyncOperationsOrchestrator = new AsyncOperationsOrchestrator(
            _disableAsyncValidation
        );

        this._getState = () => {
            if (!this.state.current) {
                this.state.current = getState();
            }
            return this.state.current;
        };

        this._applyState = applyState;

        this._initMiddlewares(middlewares, middlewareContextGetter);
    }

    /**
     * Распространяет переданное действие через промежуточные обработчики.
     *
     * Если диспетчер уничтожен, действие не отправляется.
     *
     * Распространение можно отменить.
     * @async
     */
    async dispatch(action: TAction): Promise<TState> {
        const initialState = this._getState();

        // Проверяем, что распространение позвали вовремя.
        // Отлавливаем всё, до этой точки мы дойдем синхронно из публичного API.
        if (this._validateSession(action)) {
            return initialState;
        }

        // Проверяем, что за время потенциальной загрузки модуля отладки не произошло разрушение.
        // Если за время загрузки модуля произошло разрушения, то это не ошибка.
        if (this._validateSession(action, { isDestroyed: false })) {
            return initialState;
        }

        if (this._debugger) {
            this._debugger.markPublicAction(action);
        }

        this._dispatchingInfo = {
            action,
            promise: this._dispatch(action),
            isRejected: false,
        };
        await this._dispatchingInfo.promise;

        const result =
            this._dispatchingInfo.isRejected || this._isDestroyed ? initialState : this._getState();

        this.state.current = undefined;
        this._dispatchingInfo = undefined;
        return result;
    }

    /**
     * Отменить распространение действия.
     */
    rejectDispatch(): Promise<void> {
        if (!this._asyncOperationsOrchestrator.isIdle) {
            this._asyncOperationsOrchestrator.rejectPendingOperations();
        }
        if (this._dispatchingInfo) {
            this._dispatchingInfo.isRejected = true;
            return this._dispatchingInfo.promise;
        }
        return Promise.resolve();
    }

    /**
     * Указывает, происходит ли в данный момент распространение какого либо действия.
     */
    isDispatching(): boolean {
        return !!this._dispatchingInfo;
    }

    /**
     * Фозвращает флаг, находится ли Dispatcher в состоянии покоя.
     * Состояние покоя - это состояние при котором не происходит распространиение и нет
     * зарегистрированных незавершенных Promise.
     * */
    isIdle() {
        return !this.isDispatching() && this._asyncOperationsOrchestrator.isIdle;
    }

    /**
     * Уничтожает диспетчер.
     */
    async destroy() {
        this._isDestroyed = true;
        this._asyncOperationsOrchestrator.destroy();
        await this.rejectDispatch();
    }

    setDebugger(instance?: Debugger): void {
        if (this._debugger !== instance) {
            this._debugger = instance;
        }
    }

    /**
     * Инициализирует диспетчер, создавая экземпляры промежуточных обработчиков.
     */
    private _initMiddlewares(
        creators: TAbstractMiddleware<TState, TAction, TMiddlewareContext>[],
        contextGetter: TAbstractMiddlewareContextGetter<TState, TAction, TMiddlewareContext>
    ) {
        const dispatch = this._dispatch.bind(this);

        const getState = this._getState.bind(this);

        const setInnerState = (state: Partial<TState>) => {
            const prevState = this._getState();
            const nextState = {
                ...prevState,
                ...state,
            };
            this.state.current = nextState;
            return {
                prevState,
                nextState,
            };
        };

        this._middlewares = creators.map((middleware) =>
            middleware({
                ...contextGetter(),
                dispatch: (action) => {
                    this._debugger?.markInnerAction(action, middleware.name);
                    return dispatch(action);
                },
                getState,
                setState: (state: Partial<TState>) => {
                    const { prevState, nextState } = setInnerState(state);
                    this._debugger?.innerSetState(prevState, nextState, state);
                },
                applyState: (state: Partial<TState>) => {
                    const { prevState, nextState } = setInnerState(state);
                    this._debugger?.immediateSetState(prevState, nextState, state);
                    this._applyState(state);
                },
                registerPendingPromise: async (key, promise, strategy) => {
                    if (this._isDestroyed) {
                        return getError('DESTROYED_INSTANCE');
                    }
                    if (this._dispatchingInfo?.isRejected) {
                        return getError('DISPATCH_CANCELED');
                    }
                    return (
                        this._asyncOperationsOrchestrator.registerPendingPromise(
                            `${middleware.name}:${key}`,
                            promise,
                            strategy
                        ) ?? promise
                    );
                },
            } as TMiddlewareContext)
        );
    }

    /**
     * Внутренний метод отправки действия через промежуточные обработчики.
     */
    private async _dispatch(action: TAction) {
        if (this._isDestroyed || this._dispatchingInfo?.isRejected) {
            return;
        }
        this._debugger?.startDispatch(action);

        let listActions: TAction[] = [action];
        let nextActions: TAction[] = [];

        const next: TPushActionToNextMiddleware<TAction> = (nextAction: TAction) => {
            nextActions.push(nextAction);
        };

        for (const middleware of this._middlewares) {
            for (const currentAction of listActions) {
                if (this._isDestroyed || this._dispatchingInfo?.isRejected) {
                    return;
                }
                try {
                    await middleware(next)(currentAction);
                } catch (e: unknown) {
                    if (this._debugger && e instanceof Error) {
                        this._debugger.handleDispatchError(e);
                    }
                    logger.error(e, this);
                }
            }
            listActions = nextActions;
            nextActions = [];
        }

        this._debugger?.endDispatch();
    }

    private _validateSession(
        action: TAction,
        {
            isDestroyed = true,
            isDispatching = true,
        }: { isDestroyed?: boolean; isDispatching?: boolean } = {}
    ): boolean {
        if (this._isDestroyed) {
            if (isDestroyed) {
                getError('DESTROYED_INSTANCE');
            }
            return true;
        }

        if (this._dispatchingInfo) {
            if (isDispatching) {
                getError('DISPATCH_COLLISION', this._dispatchingInfo.action, action);
            }
            return true;
        }

        return false;
    }
}

const getError = async <T extends keyof typeof TDispatcherErrorDescriptors>(
    descriptorName: T,
    ...args: Parameters<(typeof TDispatcherErrorDescriptors)[T]>
) =>
    (
        await loadAsync<typeof import('Controls-DataEnv/errorDescriptors')>(
            'Controls-DataEnv/errorDescriptors'
        )
    ).Dispatcher[descriptorName](
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ...args
    );
