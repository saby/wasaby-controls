/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия, для загрузки предыдущей пачки данных.
 */
export type TLoadPrevAction = TAbstractAction<'prev', {}>;

/**
 * Тип действия, для загрузки следующей пачки данных.
 */
export type TLoadNextAction = TAbstractAction<'next', {}>;

/**
 * Тип действий для работы с источником данных, доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnySourceAction = TLoadPrevAction | TLoadNextAction;
