/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractListActionCreators } from 'Controls-DataEnv/abstractList';
import { TListMiddleware } from 'Controls/dataFactory';
import {
    _private_createActionsMap as createActionsMap,
    _private_isValidActions as isValidSliceItemActions,
} from 'Controls-DataEnv/abstractList';

export const itemActions: TListMiddleware =
    ({ dispatch, getState, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'updateItemActionsMap': {
                if (!(getState().itemActions && isValidSliceItemActions(getState().itemActions))) {
                    break;
                }
                //# region Обновление состояния
                const result = new Map(getState().itemActionsMap);
                const newMap = createActionsMap(getState().items, getState());
                newMap.forEach((value, key) => {
                    result.set(key, value);
                });
                setState({
                    itemActionsMap: result,
                });
                //# endregion
                break;
            }
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
