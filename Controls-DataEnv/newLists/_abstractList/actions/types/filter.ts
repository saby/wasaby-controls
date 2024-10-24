/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TFilter } from 'Controls-DataEnv/interface';

/**
 * Тип действия для установки нового фильтра.
 */
export type TSetFilterAction = TAbstractAction<
    'setFilter',
    {
        filter: TFilter;
    }
>;

/**
 * Тип действия для открытия окон фильтров.
 */
export type TOpenFilterDetailPanelAction = TAbstractAction<'openFilterDetailPanel', {}>;

/**
 * Тип действия для закрытия окон фильтров.
 */
export type TCloseFilterDetailPanelAction = TAbstractAction<'closeFilterDetailPanel', {}>;

/**
 * Тип действий функционала "Фильтрация", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
 */
export type TAnyFilterAction =
    | TSetFilterAction
    | TOpenFilterDetailPanelAction
    | TCloseFilterDetailPanelAction;
