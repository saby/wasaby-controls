import {
    TAbstractMiddleware,
    TAbstractMiddlewareCreator,
} from '../../AbstractDispatcher/types/TAbstractMiddleware';
import { TListAction } from './TListAction';
import { TListMiddlewareContext } from './TListMiddlewareContext';

export type TListMiddleware = TAbstractMiddleware<TListAction>;
export type TListMiddlewareCreator = TAbstractMiddlewareCreator<
    TListAction,
    TListMiddlewareContext,
    TListMiddleware
>;
