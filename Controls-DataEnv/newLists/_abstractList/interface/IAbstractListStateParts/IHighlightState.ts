import { TKey } from 'Controls-DataEnv/interface';

/**
 * Значение подсветки, конкретный диапазон или заданная подстрока.
 */
export type THighlightedValue = string | [number, number];

/**
 * Модель подсвеченных значений в строках.
 */
export type THighlightedFieldsMap = Map<TKey, THighlightedValue[]>;

/**
 * Интерфейс состояния для работы с подсветкой строк и отдельных значений в списке.
 */
export interface IHighlightState {
    highlightedFieldsMap: THighlightedFieldsMap;
}
