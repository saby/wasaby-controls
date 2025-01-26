import { itemActions } from 'Controls-DataEnv/newLists/_list/actions/types';

import type { IListState } from '../../interface/IListState';

/**
 * Конструктор действия для комплексного обновления действий над записями.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return itemActions.TComplexUpdateItemActionsAction
 */
export const complexUpdateItemActions = (
    prevState: IListState,
    nextState: IListState
): itemActions.TComplexUpdateItemActionsAction => ({
    type: 'complexUpdateItemActions',
    payload: {
        prevState,
        nextState,
    },
});
