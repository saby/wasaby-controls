import aCreator from './_actionCreator';
import { type interactorCore } from '../types';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import type { TAbstractListActions } from '../../actions';

import * as coreActions from '../types/_interactorCore';

/**
 * Конструктор действия, для установки подключения слоя представления к ViewModel.
 */
export const connect = (): interactorCore.TConnectAction => aCreator('connect');

/**
 * Конструктор действия, для отключения слоя представления от ViewModel.
 */
export const disconnect = (): interactorCore.TDisconnectAction => aCreator('disconnect');

/**
 * Конструктор действия для метода установки нового состояния.
 * @function
 * @param {IAbstractListState | ((nextState: IAbstractListState) => IAbstractListState} nextState новое состояние
 * @return interactorCore.TPublicSetStateAction
 */
export const publicSetState = <TState extends IAbstractListState = IAbstractListState>(
    nextState: Partial<TState> | ((prevState: TState) => Partial<TState>)
): interactorCore.TPublicSetStateAction<TState> =>
    aCreator(coreActions.PublicSetStateSymbol, {
        nextState,
    });

/**
 * Конструктор действия для применения нового состояния, расчитанного в publicSetState.
 * @function
 * @param {Partial<TState>} partialNextState новое состояние
 * @return interactorCore.TOnPublicSetStateAction
 */
export const onPublicSetState = <TState extends IAbstractListState = IAbstractListState>(
    partialNextState: Partial<TState>
): interactorCore.TOnPublicSetStateAction<TState> =>
    aCreator('onPublicSetState', {
        partialNextState,
    });

/**
 * Конструктор действия, для фазы расчета состояния перед исполнением экшенов..
 * @function
 * @return interactorCore.TOnBeforeStartUpdateAction
 */
export const onBeforeStartUpdate = (): interactorCore.TOnBeforeStartUpdateAction =>
    aCreator('onBeforeStartUpdate', {});

/**
 * Конструктор действия для фазы расчета состояния по экшенам.
 * @function
 * @param {IAbstractListState} prevState Прошлое состояние
 * @param {TAbstractListActions.TAnyAbstractListAction[]} actions Испоняемые экшены
 * @return interactorCore.TStartUpdateAction
 */
export const startUpdate = (
    prevState: IAbstractListState,
    actions: TAbstractListActions.TAnyAbstractListAction[]
): interactorCore.TStartUpdateAction =>
    aCreator(coreActions.StartUpdateSymbol, {
        prevState,
        actions,
    });

/**
 * Конструктор действия, для фазы после расчета состояния по экшенам и до выполнения прикладного bas
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @return interactorCore.TOnAfterStartUpdateAction
 */
export const onAfterStartUpdate = <TState extends IAbstractListState>(
    prevState: TState
): interactorCore.TOnAfterStartUpdateAction<TState> =>
    aCreator('onAfterStartUpdate', {
        prevState,
    });

/**
 * Конструктор действия для имитации фазы старого beforeApplyState для прикладника.
 * @function
 * @param {IAbstractListState} prevState Прошлое состояние
 * @param {IAbstractListState} nextState Прошлое состояние
 * @return interactorCore.TBeforeApplyStateAction
 */
export const beforeApplyState = (
    prevState: IAbstractListState,
    nextState: IAbstractListState
): interactorCore.TBeforeApplyStateAction =>
    aCreator(coreActions.BeforeApplyStateSymbol, {
        prevState,
        nextState,
    });

// будет удален после переноса блокирующих загрузок в неблокирующие
/**
 * Конструктор действия, для имитации фазы старого beforeApplyState.
 * @function
 * @param {IListState} prevState Прошлое состояние
 * @return interactorCore.TOnAfterBeforeApplyStateAction
 */
export const onAfterBeforeApplyState = <TState extends IAbstractListState>(
    prevState: TState
): interactorCore.TOnAfterBeforeApplyStateAction<TState> =>
    aCreator('onAfterBeforeApplyState', {
        prevState,
    });
