import {
    Dispatcher,
    TAbstractAction,
    TAbstractMiddleware,
    TAbstractMiddlewareContext,
} from 'Controls-DataEnv/dispatcher';

type TState = {
    root: string;
    items: number[];
    loading: boolean;
};

type TRootActions =
    | TAbstractAction<'setRoot', { root: string }>
    | TAbstractAction<'initRoot'>
    | TAbstractAction<'incrementRoot'>;
type TDataActions = TAbstractAction<'load'>;
type TActions = TRootActions | TDataActions;

const rootMiddleware: TAbstractMiddleware<
    TState,
    TActions,
    TAbstractMiddlewareContext<TState, TActions>
> =
    ({ getState, setState, dispatch }) =>
    (next) =>
    async (action) => {
        if (action.type === 'setRoot') {
            setState({
                root: '3',
            });

            await dispatch({
                type: 'load',
                payload: {},
            });
        } else if (action.type === 'initRoot') {
            setState({
                root: '1',
            });
        } else if (action.type === 'incrementRoot') {
            setState({
                root: `${Number.parseInt(getState().root, 10) + 1}`,
            });
        }
        next(action);
    };

const dataMiddleware: TAbstractMiddleware<
    TState,
    TActions,
    TAbstractMiddlewareContext<TState, TActions>
> =
    ({ applyState, setState }) =>
    (next) =>
    async (action) => {
        if (action.type === 'load') {
            applyState({
                loading: true,
            });
            await new Promise((resolve) => {
                setTimeout(resolve, 200);
            });
            setState({
                items: [1, 2, 3],
            });
            applyState({
                loading: false,
            });
        }
        next(action);
    };

describe('Controls-DataEnv/dispatcher:Dispatcher', () => {
    it('Если состояние не изменялось, то должно вернуться то же состояние.', async () => {
        const state: TState = {
            root: 'null',
            items: [],
            loading: false,
        };

        const dispatcher = new Dispatcher<
            TState,
            TActions | TAbstractAction<'mock'>,
            TAbstractMiddlewareContext<TState, TActions | TAbstractAction<'mock'>>
        >({
            getState: () => state,
            applyState: jest.fn().mockReturnValue(new Error()),
            middlewares: [
                () => (next) => async (action) => {
                    next(action);
                },
            ],
            middlewareContextGetter: () => ({}),
        });

        const newState = await dispatcher.dispatch({
            type: 'mock',
            payload: {},
        });

        expect(state).toBe(newState);
    });

    it('Взаимодействие двух middleware-функций', async () => {
        let state: TState = {
            root: 'null',
            items: [],
            loading: false,
        };

        const mutations: { name: string; value: unknown }[] = [];

        const d = new Dispatcher({
            getState: () => state,
            applyState: (s) => {
                mutations.push({
                    name: 'loading',
                    value: s.loading,
                });
            },
            middlewares: [rootMiddleware, dataMiddleware],
            middlewareContextGetter: () => ({}),
        });

        state = await d.dispatch({
            type: 'initRoot',
            payload: {},
        });

        expect(state.root).toBe('1');

        state = await d.dispatch({
            type: 'incrementRoot',
            payload: {},
        });

        expect(state.root).toBe('2');

        state = await d.dispatch({
            type: 'setRoot',
            payload: { root: '3' },
        });

        expect(state.root).toBe('3');
        expect(state.items.length).toBe(3);

        expect(mutations.length).toBe(2);
        expect(mutations[0].value).toBe(true);
        expect(mutations[1].value).toBe(false);
    });

    //TODO: Добавить тест для проверки порядка распространения.
});
