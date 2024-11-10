import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { isEqual } from 'Types/object';
import {
    Logger as DispatcherLogger,
    withLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

import * as selectionActions from '../actions/selection';
import * as searchActions from '../actions/search';
import * as sourceActions from '../actions/source';
import * as stateActions from '../actions/state';
import { SnapshotName } from '../types/SnapshotName';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'search',
    actionsNames: ['resetSearch', 'updateSearch'],
});

export const search: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, snapshots } = withLogger(ctx, 'search');

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'resetSearch': {
                //#region Обновление маркера
                await dispatch(
                    stateActions.setState({
                        searchValue: '',
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                const state = getState();

                // Todo: ЧТО ЭТО? ВЫДЕЛЕНИЕ ЧЕРЕЗ ПМО В ДЕРЕВЕ?
                if (
                    typeof state.root !== 'undefined' &&
                    snapshots.get(SnapshotName.BeforeSearch) &&
                    state.selectedKeys?.includes(state.root) &&
                    state.excludedKeys?.includes(state.root) &&
                    // Проверка на существование снапшота выше
                    // eslint-disable-next-line
                    snapshots.get(SnapshotName.BeforeSearch)!.root !== state.root
                ) {
                    await dispatch(selectionActions.resetSelection());
                }
                //#endregion Сайд-эффекты
                break;
            }
            case 'updateSearch': {
                if (!isEqual(getState().searchValue, action.payload.searchValue)) {
                    if (action.payload.searchValue) {
                        await dispatch(
                            stateActions.setState({
                                searchValue: action.payload.searchValue,
                            })
                        );
                    } else {
                        await dispatch(searchActions.resetSearch());
                    }
                    await dispatch(sourceActions.updateSavedState());
                }

                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};
