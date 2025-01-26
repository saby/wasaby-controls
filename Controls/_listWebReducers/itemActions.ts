/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, ListWebInitializers, TListMiddleware } from 'Controls/dataFactory';
const { createActionsMap, isValidSliceItemActions } = ListWebInitializers.itemActions;

export const itemActions: TListMiddleware =
    ({ dispatch, getState, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'updateItemActionsMap': {
                if (!(getState().itemActions && isValidSliceItemActions(getState().itemActions))) {
                    break;
                }
                //#region Обновление состояния
                const result = new Map(getState().itemActionsMap);
                const newMap = createActionsMap(getState().items, getState());
                newMap.forEach((value, key) => {
                    result.set(key, value);
                });
                setState({
                    itemActionsMap: result,
                });
                //#endregion
                break;
            }
            case 'handleRemovedItems': {
                const { keys } = action.payload;
                //#region Обновление состояния
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
                //#endregion
                break;
            }
            case 'complexUpdateItemActions': {
                const { prevState, nextState } = action.payload;
                //#region Обновление состояния
                const itemActionsChanged = [
                    'itemActionsProperty',
                    'itemActions',
                    'itemActionVisibilityCallback',
                ].some((prop) => {
                    return prevState[prop] !== nextState[prop];
                });

                if (itemActionsChanged) {
                    await dispatch(ListWebActions.itemActions.updateItemActionsMap());
                    setState({
                        itemActionsProperty: nextState.itemActionsProperty,
                        itemActions: nextState.itemActions,
                        itemActionVisibilityCallback: nextState.itemActionVisibilityCallback,
                    });
                }
                //#endregion
                break;
            }
        }

        next(action);
    };
