import { TListMiddlewareCreator } from 'Controls/_dataFactory/ListWebDispatcher/types/TListMiddleware';

import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import defaultMiddlewareFactory, {
    TDefaultMiddlewareFactoryArguments,
    TDefaultMiddlewareFactoryCallback,
} from './default';

export default function asyncMiddlewareFactory(
    ...args: TAsyncMiddlewareFactoryArguments
): TListMiddlewareCreator {
    if (typeof args[0] === 'string') {
        const path = args[0];
        args[0] = async (...fnArgs) => {
            let fn: TDefaultMiddlewareFactoryCallback;

            if (isLoaded(path)) {
                fn = loadSync<TDefaultMiddlewareFactoryCallback>(path);
            } else {
                fn = await loadAsync<TDefaultMiddlewareFactoryCallback>(path);
            }

            await fn(...fnArgs);
        };
    }

    return defaultMiddlewareFactory(...(args as TAsyncMiddlewareFactoryArguments<true>));
}

export type TAsyncMiddlewareFactoryArguments<TIsLoaded = unknown> = [
    cb: TIsLoaded extends boolean
        ? TIsLoaded extends true
            ? TDefaultMiddlewareFactoryArguments[0]
            : string
        : string | TDefaultMiddlewareFactoryArguments[0],
    name: TDefaultMiddlewareFactoryArguments[1],
    actionNames: TDefaultMiddlewareFactoryArguments[2]
];
