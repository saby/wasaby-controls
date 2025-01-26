/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { _private, ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { SnapshotName } from 'Controls-DataEnv/list';
import { UILogic } from 'Controls/listsCommonLogic';
import {
    getNextItemFromArray,
    hasItemInArray,
} from 'Controls/_dataFactory/AbstractList/utils/itemUtils';
import { loadSync } from 'WasabyLoader/ModulesLoader';
const { getStateOnSearchReset } = _private;

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

                await dispatch(ListWebActions.root.setRoot(action.payload.root));

                // Если во время поиска поменяли фильтр, то надо сбросить
                // корень перед поиском, т.к мы можем в него не вернуться.
                // Сбрасываем только если запомнили корень.
                // Корень из "undefined" в "null" превращать нельзя.
                const beforeSearch = snapshots.get(SnapshotName.BeforeSearch);
                if (beforeSearch && beforeSearch.root !== undefined) {
                    beforeSearch.root = null;
                }

                //#region Сайд-эффекты

                if (action.payload.processMarker) {
                    const breadCrumbs = getState().breadCrumbsItems || [];
                    const isExistInPath = breadCrumbs?.length && hasItemInArray(breadCrumbs, root);
                    const isGoingToRoot = root === null;
                    const isGoingToDepth: boolean = !isGoingToRoot && !isExistInPath;
                    if (isGoingToDepth) {
                        // Если проваливаемся, то маркер нужно выставить в null.
                        await dispatch(ListWebActions.marker.mark(null));
                    } else {
                        // Обратно востанавливаем маркер по текущим breadCrumbs
                        const nextMarkedItem = isGoingToRoot
                            ? breadCrumbs[0]
                            : getNextItemFromArray(breadCrumbs, root);
                        const nextMarkedKey = nextMarkedItem?.getKey();
                        const markedKey = nextMarkedKey !== undefined ? nextMarkedKey : prevRoot;
                        await dispatch(ListWebActions.marker.mark(markedKey));
                    }
                }

                await dispatch(ListWebActions.expandCollapse.resetExpansion());
                if (getState().searchValue) {
                    if (getState().searchNavigationMode === 'expand') {
                        await dispatch(
                            ListWebActions.expandCollapse.setExpandedItems(
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
                        await dispatch(ListWebActions.root.setRoot(prevRoot));
                    }
                    if (action.payload.processSearch) {
                        setState(getStateOnSearchReset(getState(), snapshots));
                    }
                }

                // #endregion
                break;
            }
            case 'complexUpdateRoot': {
                const { prevState, nextState } = action.payload;
                if (prevState.root === nextState.root) {
                    break;
                }
                const processMarker =
                    // запрещены изменения в фазе beforeApplyState
                    !snapshots.get(SnapshotName.ComplexUpdate)?.isBeforeApplyState &&
                    // запрещены изменения маркера, если они пришли из publicSetState вместе с новым маркером
                    !(
                        snapshots.get(SnapshotName.ComplexUpdate)?.isPublicSetState &&
                        prevState.markedKey !== nextState.markedKey
                    );
                const processSearch = !snapshots.get(SnapshotName.ComplexUpdate)
                    ?.isBeforeApplyState;

                await dispatch(
                    ListWebActions.root.changeRoot(nextState.root, processMarker, processSearch)
                );

                break;
            }
        }

        next(action);
    };
