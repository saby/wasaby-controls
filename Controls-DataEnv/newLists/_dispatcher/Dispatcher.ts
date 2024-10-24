/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
import { TDispatcherProps, TApplyStateHook, TGetStateHook } from './types/TDispatcherProps';
import * as ErrorDescriptors from './ErrorDescriptors';
import { Guid } from 'Types/entity';

import type { Debugger } from 'Controls-DataEnv/listDebug';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { cookie } from 'Application/Env';

export const COOKIE_LOG_KEY = 'ListInteractorDebug';

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
 *
 * @author Родионов Е.А.
 */
export class Dispatcher<
    TState extends object,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> {
    private readonly _dispatcherId: string;
    private _debugger?: Debugger;

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
        dispatcherId = Guid.create(),
        middlewares,
        getState,
        applyState,
        middlewareContextGetter,
    }: TDispatcherProps<TState, TAction, TMiddlewareContext>) {
        this._dispatcherId = dispatcherId;

        this._getState = () => {
            if (!this.state.current) {
                this.state.current = getState();
            }
            return this.state.current;
        };

        this._applyState = applyState;

        // Инициализируем модуль отладки по требованию.
        this._initDebuggerSync();
        this._initMiddlewares(middlewares, middlewareContextGetter);
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
                    this._debugger?.innerSetState(prevState, nextState, state, middleware.name);
                },
                applyState: (state: Partial<TState>) => {
                    const { prevState, nextState } = setInnerState(state);
                    this._debugger?.immediateApplyState(
                        prevState,
                        nextState,
                        state,
                        middleware.name
                    );
                    this._applyState(state);
                },
            } as TMiddlewareContext)
        );
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

        // Инициализируем модуль отладки по требованию.
        await this._initDebuggerAsync();

        // Проверяем, что за время потенциальной загрузки модуля отладки не произошло разрушение.
        // Если за время загрузки модуля произошло разрушения, то это не ошибка.
        if (this._validateSession(action, { isDestroyed: false })) {
            return initialState;
        }

        if (this._debugger) {
            this._debugger.startSession(initialState);
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

        this._debugger?.endSession(result);

        this.state.current = undefined;
        this._dispatchingInfo = undefined;
        return result;
    }

    /**
     * Отменить распространение действия.
     */
    rejectDispatch(): Promise<void> {
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
                await middleware(next)(currentAction);
            }
            listActions = nextActions;
            nextActions = [];
        }

        this._debugger?.endDispatch(action);
    }

    /**
     * Уничтожает диспетчер.
     */
    destroy() {
        this.rejectDispatch();
        this._isDestroyed = true;
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
                ErrorDescriptors.DESTROYED_INSTANCE();
            }
            return true;
        }

        if (this._dispatchingInfo) {
            if (isDispatching) {
                ErrorDescriptors.DISPATCH_COLLISION(this._dispatchingInfo.action, action);
            }
            return true;
        }

        return false;
    }

    logSliceChange(state: object): void {
        this._debugger?.logSliceChange(state);
    }

    //# region Debug
    private _isDebuggerNeeded(): boolean {
        return !!cookie.get(COOKIE_LOG_KEY);
    }

    private _createDebugger({ Debugger }: typeof import('Controls-DataEnv/listDebug')) {
        this._debugger = new Debugger(this._dispatcherId, cookie.get(COOKIE_LOG_KEY) as string);
    }

    private _destroyDebugger() {
        if (this._debugger) {
            this._debugger.destroy();
            this._debugger = undefined;
        }
    }

    private _initDebuggerSync() {
        if (!this._debugger && this._isDebuggerNeeded() && isLoaded('Controls-DataEnv/listDebug')) {
            this._createDebugger(
                loadSync<typeof import('Controls-DataEnv/listDebug')>('Controls-DataEnv/listDebug')
            );
        } else {
            this._destroyDebugger();
        }
    }

    private async _initDebuggerAsync() {
        if (this._debugger) {
            return;
        }
        if (!this._isDebuggerNeeded()) {
            this._destroyDebugger();
            return;
        }
        let lib: typeof import('Controls-DataEnv/listDebug');
        if (isLoaded('Controls-DataEnv/listDebug')) {
            lib = loadSync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            );
        } else {
            lib = await loadAsync<typeof import('Controls-DataEnv/listDebug')>(
                'Controls-DataEnv/listDebug'
            );
        }
        this._createDebugger(lib);
    }

    //# endregion Debug
}
