import { TKey } from 'Controls-DataEnv/interface';

/**
 * Значение подсветки, конкретный диапазон или заданная подстрока.
 */
export type THighlightedValue = string | [number, number];

/**
 * Тип модели подсвеченных значений в строках списка.
 */
export type THighlightedFieldsMap = Map<TKey, THighlightedValue[]>;

/**
 * Интерфейс состояния для работы с подсветкой строк и отдельных значений в списке.
 */
export interface IHighlightState {
    /**
     * Модель подсвеченных значений в строках списка.
     */
    highlightedFieldsMap: THighlightedFieldsMap;
}
