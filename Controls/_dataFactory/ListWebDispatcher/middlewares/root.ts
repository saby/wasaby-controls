import { TListMiddlewareCreator } from '../types/TListMiddleware';
import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';
import { SnapshotName } from 'Controls/_dataFactory/ListWebDispatcher/types/SnapshotName';
import * as stateActions from '../actions/state';
import * as rootActions from '../actions/root';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'root',
    actionsNames: ['setRoot', 'complexUpdateRoot'],
});

export const root: TListMiddlewareCreator = (ctx) => {
    const { snapshots, dispatch, getState } = withLogger(ctx, 'marker');

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'setRoot': {
                if (getState().root === action.payload.root) {
                    break;
                }

                await dispatch(
                    stateActions.setState({
                        root: action.payload.root,
                    })
                );

                // Если во время поиска поменяли фильтр, то надо сбросить
                // корень перед поиском, т.к мы можем в него не вернуться.
                // Сбрасываем только если запомнили корень.
                // Корень из "undefined" в "null" превращать нельзя.
                const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                if (beforeSearch && beforeSearch.root !== undefined) {
                    beforeSearch.root = null;
                }

                break;
            }
            case 'complexUpdateRoot': {
                if (action.payload.prevState.root === action.payload.root) {
                    break;
                }

                await dispatch(rootActions.setRoot(action.payload.root));

                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};
