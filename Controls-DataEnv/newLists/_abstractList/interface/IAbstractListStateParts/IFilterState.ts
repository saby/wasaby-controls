import type { TFilter } from 'Controls-DataEnv/interface';

/**
 * Интерфейс базового состояния для работы с фильтрами в списке с любым типом интерактора(web/mobile).
 */
export interface IFilterBaseState {
    /**
     * Идентификатор, под которым будет сохранена история фильтра
     */
    historyId?: string;

    /**
     * Определяет, будут ли паметры фильтрации записаны в адресную строку браузера при их изменении
     */
    saveToUrl?: boolean;
}

/**
 * Интерфейс состояния для работы с фильтрами в списке с любым типом интерактора(web/mobile).
 */
export interface IFilterState extends IFilterBaseState {
    /**
     * Объект фильтра
     */
    filter?: TFilter;
}
