/**
 * Тип ключа колонки Значения типов string | number
 */
export type TColumnKey = string | number;

/**
 * Базовый интерфейс колонки
 */
export interface IBaseColumnConfig {
    /**
     * Уникальный идентификатор.
     */
    key?: TColumnKey;
}
