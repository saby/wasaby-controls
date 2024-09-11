import { TAbstractAction } from './TAbstractAction';
import { TAbstractMiddlewareContext } from './TAbstractMiddlewareContext';

export type TPushActionToNextMiddleware<TAction extends TAbstractAction = TAbstractAction> = (
    action: TAction
) => void;

export type TAbstractMiddleware<TAction extends TAbstractAction = TAbstractAction> = (
    pushActionToNextMiddleware: TPushActionToNextMiddleware<TAction>
) => (action: TAction) => Promise<void>;

export type TAbstractMiddlewareCreator<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TAction> = TAbstractMiddlewareContext<TAction>,
    TMiddleware extends TAbstractMiddleware<TAction> = TAbstractMiddleware<TAction>
> = (ctx: TMiddlewareContext) => TMiddleware;
