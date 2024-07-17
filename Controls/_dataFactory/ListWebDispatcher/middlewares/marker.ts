import { TListMiddlewareCreator } from '../types/TListMiddleware';
import * as stateActions from '../actions/state';

import { TKey } from 'Controls-DataEnv/interface';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import { getNextItemFromArray, hasItemInArray } from '../../AbstractList/utils/itemUtils';
import { AspectsNames } from 'Controls/_dataFactory/AbstractList/_interface/AspectsNames';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'marker',
    actionsNames: ['setMarkerVisibility'],
});

export const marker: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, getAspects, getCollection } = withLogger(ctx, 'marker');

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'setMarkerVisibility': {
                const markerVisibility = action.payload.visibility;

                await dispatch(
                    stateActions.setState({
                        markerVisibility,
                    })
                );

                const state = getState();

                const shouldSetMarkerOnFirstItem =
                    markerVisibility === 'visible' &&
                    (state.markedKey === undefined || state.markedKey === null);

                if (shouldSetMarkerOnFirstItem) {
                    const markerAspect = getAspects() && getAspects().get(AspectsNames.Marker);

                    if (markerAspect) {
                        await dispatch(
                            stateActions.setState({
                                markedKey: markerAspect.calculateMarkedKeyForVisible(
                                    state,
                                    getCollection()
                                ),
                            })
                        );
                    }
                }

                break;
            }
        }

        logger.exit(action);

        next(action);
    };
};

/**
 * Сохраняет текущий маркер при проваливании в узел
 * и восстанавливает при переходе по хлебным крошкам назад.
 * @param nextState
 * @private
 * @see _changeCursorBeforeLoad
 */
export function processMarkedKey(
    prevState: Partial<IListState>,
    nextState: Partial<IListState>
): TKey {
    const rootChanged = nextState.root !== prevState.root;
    const markedKeyChanged = nextState.markedKey !== prevState.markedKey;
    // Если маркер изменили руками, например, через опции,
    // Не задействуем механизм восстановления маркера.
    if (!rootChanged || markedKeyChanged) {
        return nextState.markedKey;
    }

    let markedKey;
    const breadcrumbs = prevState.breadCrumbsItems || [];
    const isExistInPath = breadcrumbs?.length && hasItemInArray(breadcrumbs, nextState.root);
    const isGoingToRoot = nextState.root === null;
    const isGoingToDepth: boolean = !isGoingToRoot && !isExistInPath;
    if (isGoingToDepth) {
        // Если проваливаемся, то маркер нужно выставить в null.
        markedKey = null;
    } else {
        // Обратно востанавливаем маркер по текущим breadCrumbs
        const nextMarkedItem = isGoingToRoot
            ? breadcrumbs[0]
            : getNextItemFromArray(breadcrumbs, nextState.root);
        const nextMarkedKey = nextMarkedItem?.getKey();
        markedKey = nextMarkedKey !== undefined ? nextMarkedKey : prevState.root;
    }
    return markedKey;
}
