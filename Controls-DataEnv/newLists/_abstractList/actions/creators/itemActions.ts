import { itemActions } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия для обновления модели, описывающей операции над записями.
 * @function
 * @return itemActions.TUpdateItemActionsMapAction
 */
export const updateItemActionsMap = (): itemActions.TUpdateItemActionsMapAction =>
    aCreator('updateItemActionsMap');
