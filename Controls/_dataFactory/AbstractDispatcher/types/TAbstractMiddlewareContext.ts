import { TAbstractDispatch } from './TAbstractDispatch';
import { TAbstractAction } from './TAbstractAction';

export type TAbstractMiddlewareContext<TAction extends TAbstractAction = TAbstractAction> = {
    dispatch: TAbstractDispatch<TAction>;
};

export type TAbstractMiddlewareContextGetter<
    TAction extends TAbstractAction = TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TAction> = TAbstractMiddlewareContext<TAction>
> = () => Omit<TMiddlewareContext, 'dispatch'>;
