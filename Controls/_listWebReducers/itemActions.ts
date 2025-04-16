/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    _private_isValidActions as isValidSliceItemActions,
    AbstractListActionCreators,
    Initializer,
    TAbstractListMiddleware,
} from 'Controls-DataEnv/abstractList';

export const itemActions: TAbstractListMiddleware =
    ({ dispatch, getState, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'updateItemActionsMap': {
                if (!(getState().itemActions && isValidSliceItemActions(getState().itemActions))) {
                    break;
                }
                //# region Обновление состояния
                const items = getState().items;
                if (!items) {
                    setState({
                        itemActionsMap: new Map(),
                    });
                    break;
                }
                const result = new Map(getState().itemActionsMap);
                const newMap = Initializer.actions.createItemActionsMap(items, getState());
                newMap.forEach((value, key) => {
                    result.set(key, value);
                });
                setState({
                    itemActionsMap: result,
                });
                //# endregion
                break;
            }
            case 'onItemsReplaced':
            case 'onItemsAdded':
            case 'onItemsReset':
            case 'onAllItemsReplaced': {
                await dispatch(AbstractListActionCreators.itemActions.updateItemActionsMap());
                break;
            }
            case 'onItemsRemoved': {
                const { keys } = action.payload;
                //# region Обновление состояния
                if (!getState().itemActionsMap) {
                    break;
                }
                const result = new Map(getState().itemActionsMap);
                keys.forEach((key) => {
                    result.delete(key);
                });
                setState({
                    itemActionsMap: result,
                });
                //# endregion
                break;
            }
        }

        next(action);
    };
