/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип действия, для смены текущего корня иерархии.
 */
export type TSetRootAction = TAbstractAction<
    'setRoot',
    {
        root: TKey;
    }
>;

/**
 * Тип действий функционала "Проваливание", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/f77b7722-2f7f-4c69-b029-a00480c0d33b Зона Kaizen
 */
export type TAnyRootAction = TSetRootAction;
