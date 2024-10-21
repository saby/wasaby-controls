/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия, для установки подключения слоя представления к ViewModel.
 */
export type TConnectAction = TAbstractAction<'connect'>;

/**
 * Тип действия, для отключения слоя представления от ViewModel.
 */
export type TDisconnectAction = TAbstractAction<'disconnect'>;

/**
 * Тип действий ядра интерактивности.
 * @see https://online.sbis.ru/area/039c82f1-a0a3-4548-82d6-c9e1dbaf5de0 Зона Kaizen
 */
export type TAnyInteractorCoreAction = TConnectAction | TDisconnectAction;
