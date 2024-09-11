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

export abstract class AbstractDispatcher<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddleware extends TAbstractMiddleware<TAction> = TAbstractMiddleware<TAction>
> {
    protected _middlewares: TMiddleware[];
    private _isDestroyed: boolean = false;

    init() {
        const dispatch = this.dispatch.bind(this);
        const middlewaresCreators = this._getMiddlewaresCreators();
        const contextGetter = this._getContextGetter();
        this._middlewares = middlewaresCreators.map((middlewareCreator) =>
            middlewareCreator({
                ...contextGetter(),
                dispatch,
            })
        );
    }

    protected abstract _getMiddlewaresCreators(): TAbstractMiddlewareCreator<
        TAction,
        TAbstractMiddlewareContext<TAction>,
        TMiddleware
    >[];

    protected abstract _getContextGetter(): TAbstractMiddlewareContextGetter<
        TAction,
        TAbstractMiddlewareContext<TAction>
    >;

    async dispatch(action: TAction) {
        if (this._isDestroyed) {
            return;
        }
        await this._dispatch(action);
    }

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

    destroy() {
        this._isDestroyed = true;
    }
}
