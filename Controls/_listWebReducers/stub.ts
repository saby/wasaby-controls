/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware, IListState } from 'Controls/dataFactory';

export const stub: TListMiddleware =
    ({ setState, dispatch, getState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'setStubVisibility': {
                const { needShowStub } = action.payload;
                // #region Обновление состояния
                setState({
                    needShowStub,
                });
                // #endregion Обновление состояния
                break;
            }
            case 'onItemsAdded':
            case 'onItemsRemoved':
            case 'onItemsReset': {
                await dispatch(
                    ListWebActions.stub.setStubVisibility(needShowEmptyTemplate(getState()))
                );
                break;
            }
        }

        next(action);
    };

function needShowEmptyTemplate(state: IListState): boolean {
    return isItemsEmpty(state);
}

function isItemsEmpty(state: IListState): boolean {
    return !!state.items && state.items.getCount() === 0;
}
