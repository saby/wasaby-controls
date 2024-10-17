/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    TListMiddleware,
    TListMiddlewareCreator,
} from 'Controls/_dataFactory/ListWebDispatcher/types/TListMiddleware';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import {
    defaultMiddlewareFactory,
    TDefaultMiddlewareFactoryArgumentsWithoutCreator,
} from './default';

/**
 * Асинхронная функция, возвращающая конструктор списочного промежуточного слоя.
 * @return {Promise<TListMiddlewareCreator>}
 * @async
 * @private
 */
type TResolver = () => Promise<TListMiddlewareCreator>;

/**
 * Путь до конструктора списочного промежуточного слоя или асинхронная функция, возвращающая его.
 * @private
 */
type TPathOrResolver = string | TResolver;

/**
 * Параметры фабрики асинхронно загружаемых конструкторов промежуточных функций (middleware).
 * Является копией типа параметров стандартной фабрики конструкторов(defaultMiddlewareFactory),
 * за исключением первого аргумента.
 * @see defaultMiddlewareFactory
 * @see TDefaultMiddlewareFactoryArguments
 * @private
 */
export type TAsyncMiddlewareFactoryArguments = [
    pathOrResolver: TPathOrResolver,
    ...args: TDefaultMiddlewareFactoryArgumentsWithoutCreator,
];

/**
 * Загружает и возвращает оригинальный конструктор списочного промежуточного слоя.
 * @param {TPathOrResolver} pathOrResolver
 * @async
 * @return {Promise<TListMiddlewareCreator>}
 * @private
 * @author Родионов Е.А.
 */
const getOriginCreator = async (
    pathOrResolver: TPathOrResolver
): Promise<TListMiddlewareCreator> => {
    let originCreator: TListMiddlewareCreator;
    if (typeof pathOrResolver === 'string') {
        if (isLoaded(pathOrResolver)) {
            originCreator = loadSync<TListMiddlewareCreator>(pathOrResolver);
        } else {
            originCreator = await loadAsync<TListMiddlewareCreator>(pathOrResolver);
        }
    } else {
        originCreator = await pathOrResolver();
    }
    return originCreator;
};

/**
 * Возвращает асинхронный конструктор промежуточной функции (middleware).
 *
 * @param {TPathOrResolver} pathOrResolver
 * @return {TListMiddlewareCreator}
 *
 * @remark
 * Когда вызовется распространение action'а, то будет асинхронно
 * загружена и единоразово сконструирована промежуточная функция.
 * @private
 * @author Родионов Е.А.
 */
const getAsyncCreator =
    (pathOrResolver: TPathOrResolver): TListMiddlewareCreator =>
    (ctx) => {
        // Замыкание оригинальной middleware, чтобы она, а следовательно и ее локальный
        // контекст создавались один раз.
        let middleware: TListMiddleware;
        return (pushActionToNextMiddleware) => async (action) => {
            if (!middleware) {
                const originCreator = await getOriginCreator(pathOrResolver);
                middleware = originCreator(ctx);
            }
            await middleware(pushActionToNextMiddleware)(action);
        };
    };

/**
 * Фабрика асинхронно загружаемых конструкторов промежуточных функций (middleware).
 * Загрузка оригинального конструктора произойдет только при
 * распространении action'а.
 * Асинхронная фабрика композирует стандартную фабрику конструкторов списочных промежуточных
 * функций (defaultMiddlewareFactory).
 * Благодаря использованию defaultMiddlewareFactory, вход в распространение является условным,
 * а следовательно и загрузка оригинального конструктора произойдет только при
 * распространении action'а, переданного в зависимости фабрики.
 *
 * @param {TAsyncMiddlewareFactoryArguments} args
 * @return {TListMiddlewareCreator}
 *
 * @see defaultMiddlewareFactory
 *
 * @private
 * @author Родионов Е.А.
 */
export const asyncMiddlewareFactory = (
    ...args: TAsyncMiddlewareFactoryArguments
): TListMiddlewareCreator => {
    // TODO: Вернуть хак для сохранения имени анонимной функции при конструировании мидлвары через фабрику.
    //  https://online.sbis.ru/opendoc.html?guid=f27fc0c4-ceb3-4ce9-a9cf-dd745d5c0f2e&client=3
    return defaultMiddlewareFactory(
        getAsyncCreator(args[0]),
        ...(args.slice(1) as TDefaultMiddlewareFactoryArgumentsWithoutCreator)
    );
};

export default asyncMiddlewareFactory;
