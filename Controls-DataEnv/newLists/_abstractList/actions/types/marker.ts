/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { CrudEntityKey } from 'Types/source';

/**
 * Тип действия, для отметки записи маркером.
 */
export type TSetMarkedKeyAction = TAbstractAction<
    'setMarkedKey',
    {
        key: CrudEntityKey | null | undefined;
    }
>;

/**
 * Тип действий функционала "Отметка маркером", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TAnyMarkerAction = TSetMarkedKeyAction;
