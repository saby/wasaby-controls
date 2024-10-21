/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListState } from '../../interface/IListState';
import type { TListActions } from '../../actions';
import type { complexUpdate } from '../types';

/**
 * Конструктор действия, для комплексного обновления.
 * Аналог beforeApplyState в прошлой итерации списочного слайса.
 */
export const beforeApplyState = (
    nextState: IListState,
    _propsForMigration: complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
    actionsToDispatch?: Map<string, TListActions.TAnyListAction>
): complexUpdate.TBeforeApplyStateAction => ({
    type: 'beforeApplyState',
    payload: {
        nextState,
        _propsForMigration,
        actionsToDispatch,
    },
});

/**
 * Конструктор действия, для выполнения старого кода комплексного обновления.
 * Непереведенный код списочного слайса.
 */
export const oldBeforeApplyState = (
    prevState: IListState,
    nextState: IListState,
    _propsForMigration: complexUpdate.TMiddlewaresPropsForMigrationToDispatcher
): complexUpdate.TOldBeforeApplyStateAction => ({
    type: 'oldBeforeApplyState',
    payload: {
        prevState,
        nextState,
        _propsForMigration,
    },
});
