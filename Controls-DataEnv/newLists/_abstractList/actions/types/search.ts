import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

/**
 * Тип действия, для сброса текущего поиска.
 */
export type TResetSearchAction = TAbstractAction<'resetSearch', {}>;

/**
 * Тип действия, для начала поиска.
 */
export type TStartSearchAction = TAbstractAction<
    'startSearch',
    {
        searchValue: string;
    }
>;

/**
 * Тип действий функционала "Взаимодействие с поиском", доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 *
 * @see https://online.sbis.ru/area/849d2ba6-201e-467e-ae1a-d32fca6084bd Зона Kaizen
 */
export type TAnySearchAction = TStartSearchAction | TResetSearchAction;
