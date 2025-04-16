import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Тип действия для отметки записи маркером.
 */
export type TMarkAction = TAbstractAction<
    'mark',
    {
        key: TKey | undefined;
    }
>;

// TODO: написать различия между экшенами, концептуально(аналогино  с changeRoot и applyRoot).
/**
 * Конструктор действия для установки нового MarkedKey
 */
export type TSetMarkedKeyAction = TAbstractAction<
    'setMarkedKey',
    {
        key: TKey | undefined;
    }
>;

/**
 * Тип действий функционала "Отметка маркером", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/c233c9ee-01af-439d-a82f-85d6ef988869 Зона Kaizen
 */
export type TAnyMarkerAction = TMarkAction | TSetMarkedKeyAction;
