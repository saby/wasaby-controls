/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { SnapshotName } from 'Controls-DataEnv/list';
import { canBeRoot } from 'Controls/_listAspects/_rootListAspect/UILogic/canBeRoot';
import {
    getNextItemFromArray,
    hasItemInArray,
} from 'Controls/_dataFactory/AbstractList/utils/itemUtils';
export const root: TListMiddleware =
    ({ snapshots, dispatch, getState, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setRoot': {
                const { root } = action.payload;
                const prevRoot = getState().root;
                if (getState().root === root || !canBeRoot(getState(), getState().root)) {
                    break;
                }

                setState({
                    root: action.payload.root,
                });

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
                        await dispatch(ListWebActions.marker.setMarkedKey(null));
                    } else {
                        // Обратно востанавливаем маркер по текущим breadCrumbs
                        const nextMarkedItem = isGoingToRoot
                            ? breadCrumbs[0]
                            : getNextItemFromArray(breadCrumbs, root);
                        const nextMarkedKey = nextMarkedItem?.getKey();
                        const markedKey = nextMarkedKey !== undefined ? nextMarkedKey : prevRoot;
                        await dispatch(ListWebActions.marker.setMarkedKey(markedKey));
                    }
                }

                await dispatch(ListWebActions.expandCollapse.resetExpansion());
                // #endregion
                break;
            }
            case 'complexUpdateRoot': {
                const { prevState, nextState } = action.payload;
                if (prevState.root === nextState.root) {
                    break;
                }
                const processMarker = prevState.markedKey === nextState.markedKey;

                await dispatch(ListWebActions.root.setRoot(nextState.root, processMarker));

                break;
            }
        }

        next(action);
    };
