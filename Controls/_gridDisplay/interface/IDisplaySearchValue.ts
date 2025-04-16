/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/**
 * Интерфейс модели записи/ячейки таблицы, содержащей значение строки поиска
 * @private
 */
export interface IDisplaySearchValue {
    readonly DisplaySearchValue: boolean;

    setSearchValue(searchValue: string): void;
}

/**
 * Интерфейс опций модели записи/ячейки таблицы, содержащей значение строки поиска
 * @private
 */
export interface IDisplaySearchValueOptions {
    searchValue?: string;
}
