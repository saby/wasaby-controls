import { TPushActionToNextMiddleware } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractMiddleware';
import { TListMiddlewareContext } from 'Controls/_dataFactory/ListWebDispatcher/types/TListMiddlewareContext';
import { TListMiddlewareCreator } from 'Controls/_dataFactory/ListWebDispatcher/types/TListMiddleware';
import { TListAction } from 'Controls/_dataFactory/ListWebDispatcher/types/TListAction';

import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

export type TDefaultMiddlewareFactoryCallback = (
    action: TListAction,
    next: TPushActionToNextMiddleware<TListAction>,
    ctx: TListMiddlewareContext
) => Promise<void>;

export type TDefaultMiddlewareFactoryArguments = [
    cb: TDefaultMiddlewareFactoryCallback,
    name: string,
    actionNames: TListAction['type'][]
];

export default function defaultMiddlewareFactory(
    ...[cb, name, actionNames]: TDefaultMiddlewareFactoryArguments
): TListMiddlewareCreator {
    return (originCtx) => {
        const ctxWithLogger = withLogger(originCtx, 'filter');

        const logger = DispatcherLogger.getMiddlewareLogger({
            name,
            actionsNames: actionNames,
        });

        return (originNext) => async (action) => {
            if (actionNames.indexOf(action.type) !== -1) {
                logger.enter(action);

                await cb(
                    action,
                    (a: TListAction) => {
                        logger.exit(action);
                        originNext(a);
                    },
                    ctxWithLogger
                );
            }
        };
    };
}
