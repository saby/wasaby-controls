import {
    TAbstractMiddleware,
    TAbstractAction,
    TAbstractMiddlewareContext,
} from 'Controls-DataEnv/dispatcher';
import {
    conditionalMiddlewareFactory,
    TConditionalMiddlewareFactoryArguments,
} from 'Controls-DataEnv/newLists/_dispatcher/middlewareFactory/conditional';

describe('Controls-DataEnv/newLists/_dispatcher/middlewareFactory/conditional', () => {
    describe('Предикат', () => {
        type TActions = TAbstractAction<'action1'> | TAbstractAction<'action2'>;
        type TContext = TAbstractMiddlewareContext<unknown, TActions>;

        let middleware: TAbstractMiddleware<unknown, TActions, TContext>;
        let next: Parameters<ReturnType<TAbstractMiddleware<unknown, TActions, TContext>>>[0];
        let ctx: TContext;

        let isEntered: boolean;
        let isOwnAction: boolean;

        let predicate: TConditionalMiddlewareFactoryArguments<unknown, TActions, TContext>[2];

        beforeEach(() => {
            ctx = {} as TContext;
            next = jest.fn();
            isOwnAction = false;
            isEntered = false;
            predicate = jest.fn();
            middleware = () => (n) => async (a) => {
                isEntered = true;
                if (a.type === 'action1' || a.type === 'action2') {
                    isOwnAction = true;
                }
                n(a);
            };
        });

        it('Не передан, распространили прослушиваемое действие', async () => {
            const decorated = conditionalMiddlewareFactory(middleware, ['action1']);
            await decorated(ctx)(next)({
                type: 'action1',
                payload: {},
            });

            expect(isEntered).toBe(true);
            expect(isOwnAction).toBe(true);
            expect(predicate).not.toHaveBeenCalled();
        });

        it('Не передан, распространили НЕ прослушиваемое действие', async () => {
            const decorated = conditionalMiddlewareFactory(middleware, ['action1']);
            await decorated(ctx)(next)({
                type: 'action2',
                payload: {},
            });

            expect(isEntered).toBe(false);
            expect(isOwnAction).toBe(false);
            expect(predicate).not.toHaveBeenCalled();
        });

        it('Не заходим в предикат, если "отсеклись" по названиям действий', async () => {
            const decorated = conditionalMiddlewareFactory(middleware, ['action1'], predicate);
            await decorated(ctx)(next)({
                type: 'action2',
                payload: {},
            });

            expect(isEntered).toBe(false);
            expect(predicate).not.toHaveBeenCalled();
        });

        describe('Возвращаемое значение', () => {
            it('Если ничего не вернули, то считаем что нужно исполнять', async () => {
                const decorated = conditionalMiddlewareFactory(middleware, ['action1'], predicate);
                await decorated(ctx)(next)({
                    type: 'action1',
                    payload: {},
                });

                expect(isEntered).toBe(true);
                expect(isOwnAction).toBe(true);
                expect(predicate).toHaveBeenCalled();
            });

            it('Вернули true. Исполняем', async () => {
                predicate = jest.fn().mockReturnValue(true);

                const decorated = conditionalMiddlewareFactory(
                    middleware,
                    ['action1', 'action2'],
                    predicate
                );
                await decorated(ctx)(next)({
                    type: 'action1',
                    payload: {},
                });

                expect(isEntered).toBe(true);
                expect(predicate).toHaveBeenCalled();
            });

            it('Вернули false. Не исполняем', async () => {
                predicate = jest.fn().mockReturnValue(false);

                const decorated = conditionalMiddlewareFactory(
                    middleware,
                    ['action1', 'action2'],
                    predicate
                );
                await decorated(ctx)(next)({
                    type: 'action1',
                    payload: {},
                });

                expect(isEntered).toBe(false);
                expect(predicate).toHaveBeenCalled();
            });
        });
    });
});
