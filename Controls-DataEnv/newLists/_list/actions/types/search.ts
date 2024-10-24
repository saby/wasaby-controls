/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListState } from '../../interface/IListState';

// Экспорты для публичных типов.
/**
 * Тип действия, для сброса текущего поиска.
 */
export type TResetSearchAction = TAbstractListActions.search.TResetSearchAction;
/**
 * Тип действия, для начала поиска.
 */
export type TStartSearchAction = TAbstractListActions.search.TStartSearchAction;
// Экспорты для публичных типов.

/**
 * Тип действия, для комплексного обновления состояния текущего поиска.
 */
export type TUpdateSearchAction = TAbstractAction<
    'updateSearch',
    {
        prevState: IListState;
        searchValue: IListState['searchValue'];
    }
>;

/**
 * Тип действий функционала "Взаимодействие с поиском", доступные в WEB списке.
 * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
 */
export type TAnySearchAction = TAbstractListActions.search.TAnySearchAction | TUpdateSearchAction;
