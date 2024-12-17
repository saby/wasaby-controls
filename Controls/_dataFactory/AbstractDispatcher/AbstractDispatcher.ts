/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from './types/TAbstractAction';
import {
    TAbstractMiddleware,
    TAbstractMiddlewareCreator,
    TPushActionToNextMiddleware,
} from './types/TAbstractMiddleware';
import {
    TAbstractMiddlewareContext,
    TAbstractMiddlewareContextGetter,
} from './types/TAbstractMiddlewareContext';
// import { logger } from 'Application/Env';

// Пока не используется, т.к. dispatcher не готов забрать на себя механику очередей.
// const DISPATCH_COLLISION_ERROR_DESCRIPTOR = (
//     dispatchingHeadAction: TAbstractAction,
//     newCallAction: TAbstractAction
// ) =>
//     logger.error(
//         'Ошибка использования AbstractDispatcher.\n' +
//             'Произошло наслоение распространения действий.\n' +
//             'Во время выполнения цепочки распространения действия было вызвано распространение нового действия.\n' +
//             `Действие которое с инициировало первую цепочку распространения: "${dispatchingHeadAction.type}".\n` +
//             `Действие которое с инициировало вторую цепочку распространения: "${newCallAction.type}".\n` +
//             'Перед вызовом распространения нового действия, необходимо дожидаться завершения предыдущего распространения.\n'
//     );

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
 * @private
 * @author Родионов Е.А.
 */
export abstract class AbstractDispatcher<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddleware extends TAbstractMiddleware<TAction> = TAbstractMiddleware<TAction>,
> {
    protected _middlewares: TMiddleware[];
    private _isDestroyed: boolean = false;
    private _isDispatching: boolean = false;

    /**
     * Инициализирует диспетчер, создавая экземпляры промежуточных обработчиков.
     */
    init() {
        const dispatch = this.dispatch.bind(this);
        const middlewaresCreators = this._getMiddlewaresCreators();
        const contextGetter = this._getContextGetter();
        this._middlewares = middlewaresCreators.map((middlewareCreator) =>
            middlewareCreator({
                ...contextGetter(middlewareCreator),
                dispatch,
            })
        );
    }

    /**
     * Возвращает массив фабрик промежуточных обработчиков.
     */
    protected abstract _getMiddlewaresCreators(): TAbstractMiddlewareCreator<
        TAction,
        TAbstractMiddlewareContext<TAction>,
        TMiddleware
    >[];

    /**
     * Возвращает функцию получения контекста промежуточного обработчика.
     */
    protected abstract _getContextGetter(): TAbstractMiddlewareContextGetter<
        TAction,
        TAbstractMiddlewareContext<TAction>,
        TMiddleware
    >;

    /**
     * Отправляет действие через диспетчер.
     *
     * Если диспетчер уничтожен, действие не отправляется.
     */
    async dispatch(action: TAction) {
        if (this._isDestroyed) {
            return;
        }
        this._isDispatching = true;
        await this._dispatch(action);
        this._isDispatching = false;
    }

    /**
     * Указывает, происходит ли в данный момент распространение какого либо действия.
     */
    isDispatching(): boolean {
        return this._isDispatching;
    }

    /**
     * Внутренний метод отправки действия через промежуточные обработчики.
     */
    private async _dispatch(action: TAction) {
        let listActions: TAction[] = [action];
        let nextActions: TAction[] = [];

        const next: TPushActionToNextMiddleware<TAction> = (nextAction: TAction) => {
            nextActions.push(nextAction);
        };

        for (const middleware of this._middlewares) {
            for (const currentAction of listActions) {
                if (this._isDestroyed) {
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
        this._isDestroyed = true;
    }
}
