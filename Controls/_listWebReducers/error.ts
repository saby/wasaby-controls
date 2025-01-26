import { TListMiddleware, TListMiddlewareContext, _private } from 'Controls/dataFactory';

const { getStateAfterLoadError } = _private;

export const error: TListMiddleware =
    ({ setState, getState }: TListMiddlewareContext) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'handleLoadError': {
                const { error, direction, loadKey } = action.payload;
                const { loading, errorViewConfig, errorController } = await getStateAfterLoadError(
                    getState(),
                    getState(),
                    error,
                    { direction, loadKey, action: action.payload.action }
                );
                setState({ loading, error, errorViewConfig, errorController });
            }
        }

        next(action);
    };
