import { TListMiddleware, TListMiddlewareContext } from 'Controls-DataEnv/list';
import { getStateAfterLoadError } from './utils';

export const error: TListMiddleware =
    ({ setState, getState }: TListMiddlewareContext) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'handleLoadError': {
                const { error: descriptor, direction, loadKey } = action.payload;
                const { loading, errorViewConfig, errorController } = await getStateAfterLoadError(
                    getState(),
                    getState(),
                    descriptor,
                    { direction, loadKey, action: action.payload.action }
                );
                setState({ loading, error: descriptor, errorViewConfig, errorController });
            }
        }

        next(action);
    };
