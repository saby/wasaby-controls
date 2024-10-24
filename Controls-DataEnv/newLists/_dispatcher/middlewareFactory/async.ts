/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type {
    TAbstractMiddleware,
    TAbstractMiddlewareWithoutContext,
} from '../types/TAbstractMiddleware';
import type { TAbstractAction } from '../types/TAbstractAction';
import type { TAbstractMiddlewareContext } from '../types/TAbstractMiddlewareContext';

import {
    conditionalMiddlewareFactory,
    type TConditionalMiddlewareFactoryArgumentsWithoutCreator,
} from './conditional';
import { addName, createMask, decorateName, undecorateName } from './utils';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Асинхронная функция, возвращающая промежуточный слой.
 * @return {Promise<TAbstractMiddleware>}
 * @async
 * @author Родионов Е.А.
 */
type TResolver<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = () => Promise<TAbstractMiddleware<TState, TAction, TMiddlewareContext>>;

/**
 * Путь до промежуточного слоя или асинхронная функция, возвращающая его.
 * @author Родионов Е.А.
 */
type TPathOrResolver<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = string | TResolver<TState, TAction, TMiddlewareContext>;

/**
 * Параметры фабрики асинхронно загружаемых промежуточных функций(middleware).
 * Является копией типа параметров фабрики условного захода в промежуточную функцию(conditionalMiddlewareFactory),
 * за исключением первого аргумента.
 * @remark
 * > Т.к. тип является копией типа параметров фабрики условного захода в промежуточную функцию(TConditionalMiddlewareFactoryArguments),
 * > то при его расширении данный тип расширится автоматически.
 * @author Родионов Е.А.
 */
export type TAsyncMiddlewareFactoryArguments<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = [
    pathOrResolver: TPathOrResolver<TState, TAction, TMiddlewareContext>,
    ...args: TConditionalMiddlewareFactoryArgumentsWithoutCreator<TAction>,
];

const DECORATED_MASK = createMask('async');

/**
 * Загружает и возвращает оригинальную middleware-функцию.
 * @param {TPathOrResolver} pathOrResolver Путь до промежуточного слоя или асинхронная функция, возвращающая его.
 * @async
 * @return {Promise<TAbstractMiddleware>}
 * @author Родионов Е.А.
 */
const resolveOriginCreator = async <
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
>(
    pathOrResolver: TPathOrResolver<TState, TAction, TMiddlewareContext>
): Promise<TAbstractMiddleware<TState, TAction, TMiddlewareContext>> => {
    let originCreator: TAbstractMiddleware<TState, TAction, TMiddlewareContext>;
    if (typeof pathOrResolver === 'string') {
        if (isLoaded(pathOrResolver)) {
            originCreator =
                loadSync<TAbstractMiddleware<TState, TAction, TMiddlewareContext>>(pathOrResolver);
        } else {
            originCreator =
                await loadAsync<TAbstractMiddleware<TState, TAction, TMiddlewareContext>>(
                    pathOrResolver
                );
        }
    } else {
        originCreator = await pathOrResolver();
    }
    return originCreator;
};

/**
 * Возвращает декорированную middleware-функцию, которая загружает оригинальную функцию только при
 * распространении любого ***действия***(ленивая загрузка).
 *
 * @remark
 * > Когда вызовется распространение ***действия***, то будет асинхронно
 * > загружена и единоразово сконструирована промежуточная функция.
 *
 * @param {TPathOrResolver} pathOrResolver Путь до промежуточного слоя или асинхронная функция, возвращающая его.
 * @return {TAbstractMiddleware}
 *
 * @see TPathOrResolver
 * @see TAbstractMiddleware
 *
 * @author Родионов Е.А.
 */
const getAsyncCreator = <
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
>(
    pathOrResolver: TPathOrResolver<TState, TAction, TMiddlewareContext>
): TAbstractMiddleware<TState, TAction, TMiddlewareContext> => {
    const name = decorateName(
        DECORATED_MASK,
        typeof pathOrResolver === 'function' ? pathOrResolver.name : pathOrResolver
    );
    return addName(name, ((ctx) => {
        // Замыкание оригинальной middleware, чтобы она, а следовательно и ее локальный
        // контекст создавались один раз.
        let middleware: TAbstractMiddlewareWithoutContext<TAction>;
        return addName(name, ((next) => async (action) => {
            if (!middleware) {
                middleware = (await resolveOriginCreator(pathOrResolver))(ctx);
            }
            await middleware(next)(action);
        }) as TAbstractMiddlewareWithoutContext<TAction>);
    }) as TAbstractMiddleware<TState, TAction, TMiddlewareContext>);
};

/**
 * Фабрика асинхронно загружаемых промежуточных функций (middleware).
 * Загрузка оригинальной функции произойдет только при распространении "отслеживаемого" действия.
 *
 * @remark
 * > Асинхронная фабрика композирует фабрику условного захода в промежуточную функцию (conditionalMiddlewareFactory).
 * > Благодаря использованию ***conditionalMiddlewareFactory***, вход в распространение является условным,
 * > а следовательно и загрузка оригинальной функции произойдет только при
 * > распространении действия, переданного в зависимости фабрики.
 *
 * @param {TAsyncMiddlewareFactoryArguments} args
 * @return {TAbstractMiddleware}
 *
 * @see conditionalMiddlewareFactory
 *
 * @private
 * @author Родионов Е.А.
 */
export const asyncMiddlewareFactory = <
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
>(
    ...args: TAsyncMiddlewareFactoryArguments<TState, TAction, TMiddlewareContext>
): TAbstractMiddleware<TState, TAction, TMiddlewareContext> => {
    // TODO: Вернуть хак для сохранения имени анонимной функции при конструировании мидлвары через фабрику.
    //  https://online.sbis.ru/opendoc.html?guid=f27fc0c4-ceb3-4ce9-a9cf-dd745d5c0f2e&client=3
    return conditionalMiddlewareFactory(
        getAsyncCreator(args[0]),
        ...(args.slice(1) as TConditionalMiddlewareFactoryArgumentsWithoutCreator<TAction>)
    );
};

asyncMiddlewareFactory.undecorateName = (decoratedName: string) =>
    undecorateName(DECORATED_MASK, decoratedName);
