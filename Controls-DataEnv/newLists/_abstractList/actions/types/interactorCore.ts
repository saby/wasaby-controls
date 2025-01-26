import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import type { TAbstractListActions } from '../../actions';
import type * as _interactorCore from './_interactorCore';

/**
 * Тип действия, для установки подключения слоя представления к ViewModel.
 */
export type TConnectAction = TAbstractAction<'connect'>;

/**
 * Тип действия, для отключения слоя представления от ViewModel.
 */
export type TDisconnectAction = TAbstractAction<'disconnect'>;

/**
 * Тип действия для публичного метода установки нового состояния.
 */
export type TPublicSetStateAction<TState extends IAbstractListState> = TAbstractAction<
    _interactorCore.TPublicSetStateSymbol,
    {
        nextState: Partial<TState> | ((prevState: TState) => Partial<TState>);
    }
>;

/**
 * Тип действия для применения нового состояния, расчитанного в publicSetState.
 */
export type TOnPublicSetStateAction<TState extends IAbstractListState> = TAbstractAction<
    'onPublicSetState',
    {
        partialNextState: Partial<TState>;
    }
>;

/**
 * Тип действия, для фазы расчета состояния перед исполнением экшенов.
 */
export type TOnBeforeStartUpdateAction = TAbstractAction<'onBeforeStartUpdate', {}>;

/**
 * Тип действия для расчета состояния по экшенам.
 */
export type TStartUpdateAction = TAbstractAction<
    _interactorCore.TStartUpdateSymbol,
    {
        prevState: IAbstractListState;
        actions: TAbstractListActions.TAnyAbstractListAction[];
    }
>;

/**
 * Тип действия, для фазы после расчета состояния по экшенам и до выполнения прикладного bas
 */
export type TOnAfterStartUpdateAction<TState extends IAbstractListState> = TAbstractAction<
    'onAfterStartUpdate',
    {
        prevState: TState;
    }
>;

/**
 * Тип действия для имитации старого beforeApplyState для прикладника.
 */
export type TBeforeApplyStateAction = TAbstractAction<
    _interactorCore.TBeforeApplyStateSymbol,
    {
        prevState: IAbstractListState;
        nextState: IAbstractListState;
    }
>;

/**
 * Тип действия, для имитации фазы старого beforeApplyState.
 */
export type TOnAfterBeforeApplyStateAction<TState extends IAbstractListState> = TAbstractAction<
    'onAfterBeforeApplyState',
    {
        prevState: TState;
    }
>;

/**
 * Тип действий ядра интерактивности.
 * @see https://online.sbis.ru/area/039c82f1-a0a3-4548-82d6-c9e1dbaf5de0 Зона Kaizen
 */
export type TAnyInteractorCoreAction<TState extends IAbstractListState> =
    | TConnectAction
    | TDisconnectAction
    | TOnPublicSetStateAction<TState>
    | TStartUpdateAction
    | TBeforeApplyStateAction
    | TPublicSetStateAction<TState>
    | TOnAfterStartUpdateAction<TState>
    | TOnBeforeStartUpdateAction
    | TOnAfterBeforeApplyStateAction<TState>;
