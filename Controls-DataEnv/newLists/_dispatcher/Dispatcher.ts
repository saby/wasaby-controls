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
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> {
    // TODO: Понадобятся при реализации системы логирования.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly _dispatcherId: string;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _sessionNumber: number = 1;

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
        this._getState = () => {
            if (!this.state.current) {
                this.state.current = getState();
            }
            return this.state.current;
        };

        this._applyState = applyState;

        this._dispatcherId = dispatcherId;

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

        const setState = (state: Partial<TState>) => {
            this.state.current = {
                ...(this.state.current || this._getState()),
                ...state,
            };
        };

        const applyState = (state: Partial<TState>) => {
            setState(state);
            this._applyState(state);
        };

        this._middlewares = creators.map((middlewareCreator) =>
            middlewareCreator({
                ...contextGetter(),
                dispatch,
                getState,
                setState,
                applyState,
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

        this._sessionNumber++;

        if (this._isDestroyed) {
            ErrorDescriptors.DESTROYED_INSTANCE();
            return initialState;
        }

        if (this._dispatchingInfo) {
            ErrorDescriptors.DISPATCH_COLLISION(this._dispatchingInfo.action, action);
            return initialState;
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
    }

    /**
     * Уничтожает диспетчер.
     */
    destroy() {
        this.rejectDispatch();
        this._isDestroyed = true;
    }
}
