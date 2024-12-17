/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */

import { TKey } from 'Controls-DataEnv/interface';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import { getNextItemFromArray, hasItemInArray } from '../../AbstractList/utils/itemUtils';

import asyncMiddlewareFactory from '../middlewareFactory/async';

export const marker = asyncMiddlewareFactory('Controls/listWebReducers:marker', 'marker', [
    'setMarkerVisibility',
    'activateMarker',
    'setMarkedKey',
    'complexUpdateMarker',
]);

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
