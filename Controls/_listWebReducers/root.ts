/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TListMiddleware } from 'Controls-DataEnv/list';
import type { TKey } from 'Controls-DataEnv/interface';
import type { Model } from 'Types/entity';

import { ListActionCreators, SnapshotName } from 'Controls-DataEnv/list';
import { UILogic } from 'Controls/listsCommonLogic';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { getStateOnSearchReset } from './utils';

export const root: TListMiddleware =
    ({ snapshots, dispatch, getState, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setRoot': {
                setState({
                    root: action.payload.root,
                });
                break;
            }
            case 'changeRoot': {
                const { root } = action.payload;
                const prevRoot = getState().root;
                if (
                    getState().root === root ||
                    !UILogic.Hierarchy.canBeRoot(getState(), getState().root)
                ) {
                    break;
                }

                await dispatch(ListActionCreators.root.setRoot(action.payload.root));

                // Если во время поиска поменяли фильтр, то надо сбросить
                // корень перед поиском, т.к мы можем в него не вернуться.
                // Сбрасываем только если запомнили корень.
                // Корень из "undefined" в "null" превращать нельзя.
                const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                if (beforeSearch && beforeSearch.root !== undefined) {
                    beforeSearch.root = null;
                }

                //# region Сайд-эффекты

                if (action.payload.processMarker) {
                    const breadCrumbs = getState().breadCrumbsItems || [];
                    const isExistInPath =
                        breadCrumbs?.length && breadCrumbs.some((item) => item.getKey() === root);
                    const isGoingToRoot = root === null;
                    const isGoingToDepth: boolean = !isGoingToRoot && !isExistInPath;
                    if (isGoingToDepth) {
                        // Если проваливаемся, то маркер нужно выставить в null.
                        await dispatch(ListActionCreators.marker.mark(null));
                    } else {
                        // Обратно востанавливаем маркер по текущим breadCrumbs
                        const nextMarkedItem = isGoingToRoot
                            ? breadCrumbs[0]
                            : getNextItemFromArray(breadCrumbs, root);
                        const nextMarkedKey = nextMarkedItem?.getKey();
                        const markedKey = nextMarkedKey !== undefined ? nextMarkedKey : prevRoot;
                        await dispatch(ListActionCreators.marker.mark(markedKey));
                    }
                }

                await dispatch(ListActionCreators.expandCollapse.resetExpansion());
                if (getState().searchValue) {
                    if (getState().searchNavigationMode === 'expand') {
                        await dispatch(
                            ListActionCreators.expandCollapse.setExpandedItems(
                                loadSync<typeof import('Controls/search')>(
                                    'Controls/search'
                                ).FilterResolver.getExpandedItemsForRoot(
                                    // FIXME: Types
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    root,
                                    prevRoot,
                                    getState().items,
                                    getState().parentProperty
                                )
                            )
                        );
                        await dispatch(ListActionCreators.root.setRoot(prevRoot));
                    }
                    if (action.payload.processSearch) {
                        setState(getStateOnSearchReset(getState(), snapshots));
                    }
                }

                // #endregion
                break;
            }
        }

        next(action);
    };

function getNextItemFromArray(items: Model[], key: TKey): Model | undefined {
    const currentIndexByKey = items.findIndex((item) => {
        return item.getKey() === key;
    });
    return currentIndexByKey !== -1 ? items[currentIndexByKey + 1] : undefined;
}
