/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    AbstractListActionCreators,
    TAbstractListMiddleware,
    Initializer,
} from 'Controls-DataEnv/abstractList';

export const stub: TAbstractListMiddleware =
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
                    AbstractListActionCreators.stub.setStubVisibility(
                        Initializer.emptyView.needShowEmptyView(getState().items)
                    )
                );
                break;
            }
        }

        next(action);
    };
