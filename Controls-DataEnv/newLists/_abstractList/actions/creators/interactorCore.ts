import type { interactorCore } from '../types';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки подключения слоя представления к ViewModel.
 */
export const connect = (): interactorCore.TConnectAction => aCreator('connect');

/**
 * Конструктор действия, для отключения слоя представления от ViewModel.
 */
export const disconnect = (): interactorCore.TDisconnectAction => aCreator('disconnect');
