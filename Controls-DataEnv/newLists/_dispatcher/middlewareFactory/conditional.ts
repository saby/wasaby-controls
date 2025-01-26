import type { TAbstractMiddleware } from '../types/TAbstractMiddleware';
import type { TAbstractAction } from '../types/TAbstractAction';
import type { TAbstractMiddlewareContext } from '../types/TAbstractMiddlewareContext';

import { addName, createMask, decorateName, undecorateName } from './utils';

/**
 * Параметры фабрики условного захода в промежуточную функцию(middleware).
 */
export type TConditionalMiddlewareFactoryArguments<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = [
    cb: TAbstractMiddleware<TState, TAction, TMiddlewareContext>,
    ...args: TConditionalMiddlewareFactoryArgumentsWithoutCreator<
        TState,
        TAction,
        TMiddlewareContext
    >,
];

const DECORATED_MASK = createMask('conditional');

/**
 * Часть параметров фабрики условного захода в промежуточную функцию (middleware).
 * Все параметры, кроме первого.
 * Утилитарный тип для других фабрик, расширяющих данную.
 */
export type TConditionalMiddlewareFactoryArgumentsWithoutCreator<
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> = [
    actionNames: TAction['type'][],
    predicate?: (ctx: TMiddlewareContext, action: TAction) => boolean | undefined | void,
];

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
 */
export const conditionalMiddlewareFactory = <
    TState,
    TAction extends TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
>(
    ...[mCreator, actionNames, predicate]: TConditionalMiddlewareFactoryArguments<
        TState,
        TAction,
        TMiddlewareContext
    >
): TAbstractMiddleware<TState, TAction, TMiddlewareContext> => {
    const shouldLoadOrigin = (ctx: TMiddlewareContext, action: TAction) => {
        if (actionNames.indexOf(action.type) === -1) {
            return false;
        }

        // Если ничего не вернули, то грузим
        const result = !predicate ? undefined : predicate(ctx, action);
        if (typeof result === 'undefined') {
            return true;
        }

        return result;
    };

    return addName(decorateName(DECORATED_MASK, mCreator.name), ((originCtx) => {
        const middleware = mCreator(originCtx);

        return addName(decorateName(DECORATED_MASK, middleware.name), (next) => {
            const originReducer = middleware(next);

            return async (action) => {
                if (shouldLoadOrigin(originCtx, action)) {
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
