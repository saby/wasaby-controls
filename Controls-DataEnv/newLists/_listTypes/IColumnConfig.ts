import { IBaseColumnConfig } from './IBaseColumnConfig';

/**
 * Интерфейс колонок данных
 */
export interface IColumnConfig extends IBaseColumnConfig {
    /**
     * Имя поля, данные которого отображаются в колонке.
     */
    displayProperty?: string;
}
