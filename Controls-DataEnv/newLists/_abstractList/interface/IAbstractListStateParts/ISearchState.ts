import type { TSearchNavigationMode, TSearchStartingWith } from 'Controls-DataEnv/listTypes';

/**
 * Интерфейс состояния для работы с поиском в списке с любым типом интерактора(web/mobile).
 */
export interface ISearchState {
    searchParam?: string;
    minSearchLength: number;
    searchDelay?: number;
    searchValueTrim: boolean;
    searchValue: string;
    /**
     * Значение строки поиска в правильной раскладке.
     * Подробнее поиск со сменой раскладки описан в статье {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/change-layout/ "Фильтрация и поиск".}
     */
    searchMisspellValue: string;

    /**
     * Значение строки поиска, которое отображается в поле поиска.
     */
    searchInputValue: string;

    /**
     * Режим поиска в списке с иерархией и включенной возможностью смены корня.
     * * root Поиск происходит в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/root/ корне}.
     * * current Поиск происходит в текущем разделе.
     * @default 'root'
     */
    searchStartingWith: TSearchStartingWith;

    /**
     * Режим навигации при поиске в иерархическом списке.
     * @default open
     */
    searchNavigationMode: TSearchNavigationMode;
}
