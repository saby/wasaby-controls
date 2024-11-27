import type { interactorCore } from '../types';

/**
 * Конструктор действия, для установки подключения слоя представления к ViewModel.
 * @function
 * @return interactorCore.TConnectAction
 */
export const connect = (): interactorCore.TConnectAction => ({
    type: 'connect',
    payload: {},
});

/**
 * Конструктор действия, для отключения слоя представления от ViewModel.
 * @function
 * @return interactorCore.TDisconnectAction
 */
export const disconnect = (): interactorCore.TDisconnectAction => ({
    type: 'disconnect',
    payload: {},
});
