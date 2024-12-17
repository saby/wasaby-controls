/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListMiddlewareCreator } from 'Controls/_dataFactory/ListWebDispatcher/types/TListMiddleware';
import { TListAction } from 'Controls/_dataFactory/ListWebDispatcher/types/TListAction';

import type { TMiddlewareLoggerInstance } from 'Controls-DataEnv/listDebug';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

/**
 * Параметры стандартной фабрики конструкторов списочных промежуточных функций (middleware).
 * @private
 */
export type TDefaultMiddlewareFactoryArguments = [
    cb: TListMiddlewareCreator,
    ...args: TDefaultMiddlewareFactoryArgumentsWithoutCreator,
];

/**
 * Часть параметров стандартной фабрики конструкторов списочных промежуточных функций (middleware).
 * Все параметры, кроме первого.
 * Утилитарный тип для других фабрик, расширяющих данную.
 * @private
 */
export type TDefaultMiddlewareFactoryArgumentsWithoutCreator = [
    name: string,
    actionNames: TListAction['type'][],
];

// TODO: Вернуть хак для сохранения имени анонимной функции при конструировании мидлвары через фабрику.
//  https://online.sbis.ru/opendoc.html?guid=f27fc0c4-ceb3-4ce9-a9cf-dd745d5c0f2e&client=3
/**
 * Стандартная фабрика конструкторов списочных промежуточных функций (middleware).
 * Позволяет заходить в оригинальные промежуточные функции только при распространении
 * action'а, переданного в зависимости фабрики.
 * Также, добавляет консольное логирование распространяемым action'ам.
 *
 * @param {TDefaultMiddlewareFactoryArguments} args
 * @return {TListMiddlewareCreator}
 * @private
 * @author Родионов Е.А.
 */
export const defaultMiddlewareFactory = (
    ...[mCreator, name, actionNames]: TDefaultMiddlewareFactoryArguments
): TListMiddlewareCreator => {
    let logger: TMiddlewareLoggerInstance | undefined;

    const debugLib = isLoaded('Controls-DataEnv/listDebug')
        ? loadSync<typeof import('Controls-DataEnv/listDebug')>('Controls-DataEnv/listDebug')
        : undefined;

    if (debugLib) {
        logger = debugLib.DispatcherLogger.getMiddlewareLogger({
            name,
            actionsNames: actionNames,
        });
    }

    return (originCtx) => {
        const ctxWithLogger = debugLib ? debugLib.addLoggerToContext(originCtx, name) : originCtx;
        const middlewareWithLoggedContext = mCreator(ctxWithLogger);

        return (next) => {
            const originReducer = middlewareWithLoggedContext(next);

            return async (action) => {
                if (actionNames.indexOf(action.type) !== -1) {
                    logger?.enter(action);
                    await originReducer(action);
                    logger?.exit(action);
                } else {
                    next(action);
                }
            };
        };
    };
};

export default defaultMiddlewareFactory;
