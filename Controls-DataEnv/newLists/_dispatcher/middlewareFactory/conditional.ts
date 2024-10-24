/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractMiddleware } from '../types/TAbstractMiddleware';
import type { TAbstractAction } from '../types/TAbstractAction';
import type { TAbstractMiddlewareContext } from '../types/TAbstractMiddlewareContext';

import { addName, createMask, decorateName, undecorateName } from './utils';

/**
 * Параметры фабрики условного захода в промежуточную функцию(middleware).
 * @author Родионов Е.А.
 */
export type TConditionalMiddlewareFactoryArguments<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = [
    cb: TAbstractMiddleware<TState, TAction, TMiddlewareContext>,
    ...args: TConditionalMiddlewareFactoryArgumentsWithoutCreator<TAction>,
];

const DECORATED_MASK = createMask('conditional');

/**
 * Часть параметров фабрики условного захода в промежуточную функцию (middleware).
 * Все параметры, кроме первого.
 * Утилитарный тип для других фабрик, расширяющих данную.
 * @author Родионов Е.А.
 */
export type TConditionalMiddlewareFactoryArgumentsWithoutCreator<TAction extends TAbstractAction> =
    [name: string, actionNames: TAction['type'][]];

// TODO: Вернуть хак для сохранения имени анонимной функции при конструировании мидлвары через фабрику.
//  https://online.sbis.ru/opendoc.html?guid=f27fc0c4-ceb3-4ce9-a9cf-dd745d5c0f2e&client=3
/**
 * Фабрика условного захода в промежуточную функцию(middleware).
 * Позволяет заходить в оригинальные промежуточные функции только при распространении
 * ***действия***, переданного в зависимости фабрики.
 * Также, добавляет консольное логирование распространяемым action'ам.
 *
 * @param {TConditionalMiddlewareFactoryArguments} args
 * @return {TAbstractMiddleware}
 * @author Родионов Е.А.
 */
export const conditionalMiddlewareFactory = <
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
>(
    ...[mCreator, , actionNames]: TConditionalMiddlewareFactoryArguments<
        TState,
        TAction,
        TMiddlewareContext
    >
): TAbstractMiddleware<TState, TAction, TMiddlewareContext> => {
    return addName(decorateName(DECORATED_MASK, mCreator.name), ((originCtx) => {
        const middleware = mCreator(originCtx);

        return addName(decorateName(DECORATED_MASK, middleware.name), (next) => {
            const originReducer = middleware(next);

            return async (action) => {
                if (actionNames.indexOf(action.type) !== -1) {
                    await originReducer(action);
                } else {
                    next(action);
                }
            };
        });
    }) as TAbstractMiddleware<TState, TAction, TMiddlewareContext>);
};

conditionalMiddlewareFactory.undecorateName = (decoratedName: string) =>
    undecorateName(DECORATED_MASK, decoratedName);
