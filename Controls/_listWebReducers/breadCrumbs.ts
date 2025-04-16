/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListActionCreators, TListMiddleware } from 'Controls-DataEnv/list';
import { calculatePath } from 'Controls/dataSource';

export const breadCrumbs: TListMiddleware =
    ({ setState, getState, dispatch }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setBreadCrumbs': {
                const { breadCrumbsItems, backButtonCaption, backButtonItem } = action.payload;
                setState({
                    breadCrumbsItems,
                    backButtonCaption,
                    backButtonItem,
                });
                break;
            }
            case 'handleItemsChanged': {
                const { nextItems, prevItems } = action.payload;

                //# region Обновление состояния
                const prevMetaData = prevItems?.getMetaData?.();
                const nextMetaData = nextItems?.getMetaData?.();

                if (prevMetaData?.path === nextMetaData?.path) {
                    break;
                }
                const { path, backButtonCaption, backButtonItem } = calculatePath(
                    getState().isThinInteractor ? nextMetaData?.path : nextItems,
                    getState().displayProperty
                );
                await dispatch(
                    ListActionCreators.breadCrumbs.setBreadCrumbs(
                        path,
                        backButtonCaption,
                        backButtonItem
                    )
                );
                //# endregion
                break;
            }
        }
        next(action);
    };
