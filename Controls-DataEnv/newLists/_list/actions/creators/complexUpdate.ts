import type { IListState } from '../../interface/IListState';
import type { complexUpdate } from '../types';
import type { _private_TMiddlewaresPropsForMigrationToDispatcher } from 'Controls-DataEnv/abstractList';

/**
 * Конструктор действия, для сборки нового состояния.
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @param {IListState} nextState Новое состояние
 * @return complexUpdate.TReduceStateAction
 */
export const reduceState = (
    prevState: IListState,
    nextState: IListState
): complexUpdate.TReduceStateAction => ({
    type: 'reduceState',
    payload: {
        prevState,
        nextState,
    },
});

/**
 * Конструктор действия, для выполнения старого кода комплексного обновления.
 * Непереведенный код списочного слайса.
 */
export const oldBeforeApplyState = (
    prevState: IListState,
    nextState: IListState,
    _propsForMigration: _private_TMiddlewaresPropsForMigrationToDispatcher
): complexUpdate.TOldBeforeApplyStateAction => ({
    type: 'oldBeforeApplyState',
    payload: {
        prevState,
        nextState,
        _propsForMigration,
    },
});
