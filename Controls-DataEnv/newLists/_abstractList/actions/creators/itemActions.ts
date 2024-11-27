import { itemActions } from '../types';

/**
 * Конструктор действия для обновления модели, описывающей операции над записями.
 * @function
 * @return itemActions.TUpdateItemActionsMapAction
 */
export const updateItemActionsMap = (): itemActions.TUpdateItemActionsMapAction => ({
    type: 'updateItemActionsMap',
    payload: {},
});
