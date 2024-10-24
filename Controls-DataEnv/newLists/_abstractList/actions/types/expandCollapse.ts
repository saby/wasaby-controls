/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { CrudEntityKey } from 'Types/source';

/**
 * Тип действия, для разворота узла.
 */
export type TExpandAction = TAbstractAction<
    'expand',
    {
        key: CrudEntityKey;
    }
>;

/**
 * Тип действия, для сворачивания узла.
 */
export type TCollapseAction = TAbstractAction<
    'collapse',
    {
        key: CrudEntityKey;
    }
>;

/**
 * Тип действий функционала "Разворот и сворачивание узлов", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
 */
export type TAnyExpandCollapseAction = TExpandAction | TCollapseAction;
