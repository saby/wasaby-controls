import aCreator from './_actionCreator';
import { complexUpdate } from '../types';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import type { TAbstractListActions } from '../../actions';

/**
 * Конструктор действия для установки нового состояния.
 * @function
 * @param {IAbstractListState | ((nextState: IAbstractListState) => IAbstractListState} nextState новое состояние
 * @return complexUpdate.TPublicSetStateAction
 */
export const publicSetState = <TState extends IAbstractListState = IAbstractListState>(
    nextState: Partial<TState> | ((prevState: TState) => Partial<TState>)
): complexUpdate.TPublicSetStateAction<TState> => ({
    type: 'publicSetState',
    payload: {
        nextState,
    },
});

/**
 * Конструктор действия, для первой фазы комплексного обновления состояния.
 * @function
 * @param { TAbstractListActions.TAnyAbstractListAction[] } actions Действия, которые будут выполнены
 * @return complexUpdate.TStartUpdateAction
 * @remarks В рамках этой фазы происходит вычисление изменений состояния без загрузки данных.
 */
export const startUpdate = (
    actions: TAbstractListActions.TAnyAbstractListAction[]
): complexUpdate.TStartUpdateAction =>
    aCreator('startUpdate', {
        actions,
    });

/**
 * Конструктор действия, для комплексного обновления состояния.
 * Аналог beforeApplyState в прошлой итерации списочного слайса.
 */
export const beforeApplyState = (
    nextState: IAbstractListState,
    _propsForMigration: complexUpdate.TMiddlewaresPropsForMigrationToDispatcher
): complexUpdate.TBeforeApplyStateAction =>
    aCreator('beforeApplyState', {
        nextState,
        _propsForMigration,
    });

/**
 * Конструктор действия, для последней фазы комплексного обновления.
 * В рамках этой фазы происходит загрузка данных.
 */
export const endUpdate = (
    nextState: IAbstractListState,
    _propsForMigration: complexUpdate.TMiddlewaresPropsForMigrationToDispatcher
): complexUpdate.TEndUpdateAction =>
    aCreator('endUpdate', {
        nextState,
        _propsForMigration,
    });
