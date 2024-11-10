import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { TKey } from 'Controls-DataEnv/interface';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import { getNextItemFromArray, hasItemInArray } from '../../AbstractList/utils/itemUtils';
import { AspectsNames } from 'Controls/_dataFactory/AbstractList/_interface/AspectsNames';
import {
    withLogger,
    Logger as DispatcherLogger,
} from 'Controls/_dataFactory/ListWebDispatcher/utils';

import * as stateActions from '../actions/state';
import * as markerActions from '../actions/marker';
import * as sourceActions from '../actions/source';
import * as operationsPanelActions from '../actions/operationsPanel';

const logger = DispatcherLogger.getMiddlewareLogger({
    name: 'marker',
    actionsNames: ['setMarkerVisibility', 'activateMarker', 'setMarkedKey', 'complexUpdateMarker'],
});

export const marker: TListMiddlewareCreator = (ctx) => {
    const { getState, dispatch, getAspects, getCollection } = withLogger(ctx, 'marker');

    return (next) => async (action) => {
        logger.enter(action);

        switch (action.type) {
            case 'setMarkedKey': {
                //#region Обновление маркера
                await dispatch(
                    stateActions.setState({
                        markedKey: action.payload.key,
                    })
                );
                //#endregion

                //#region Сайд-эффекты
                await dispatch(sourceActions.updateSavedState());
                await dispatch(operationsPanelActions.updateOperationsSelection());
                //#endregion Сайд-эффекты
                break;
            }
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
            case 'activateMarker': {
                // Не можем показать маркер, т.к. он скрыт вообще.
                if (getState().markerVisibility === 'hidden') {
                    break;
                }

                await dispatch(markerActions.setMarkerVisibility('visible'));

                break;
            }
            case 'complexUpdateMarker': {
                const { prevState, nextState } = action.payload;

                if (prevState.markerVisibility !== nextState.markerVisibility) {
                    // Не скрываем маркер, если открыто ПМО и прикладной разработчик
                    // пытается скрыть маркер.
                    const shouldIgnoreVisibilityChange =
                        nextState.operationsPanelVisible && nextState.markerVisibility === 'hidden';

                    // Если идет смена модели с поддерживаемой на неподдерживаемую,
                    // то в некоторых случаях не нужно проставлять маркер.
                    // Например, если маркер прикладным разработчиком не задан.
                    // У нас нет точек в слайсе, чтобы понять, задан ли маркер и нет точки,
                    // чтобы понять, какая модель будет следующая.
                    // Ошибка https://online.sbis.ru/opendoc.html?guid=883d4c50-ea09-41fb-8ba0-84178b820f6b&client=3
                    // Чтобы таких ошибок не было, нужно поддержать все модели.
                    // Задача https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
                    const isNextModelSupported = nextState.fix1193265616 !== true;

                    if (isNextModelSupported && !shouldIgnoreVisibilityChange) {
                        await dispatch(
                            markerActions.setMarkerVisibility(nextState.markerVisibility)
                        );
                    }
                }

                if (prevState.markedKey !== nextState.markedKey) {
                    await dispatch(markerActions.setMarkedKey(nextState.markedKey));
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
