/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
// 3, чтобы был запас в скролле до и после отображаемых колонок размером с выбранный диапазон
export const NAVIGATION_LIMIT_FACTOR = 3;

// Минимальная ширина динамической колонки по умолчанию
export const DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH = 20;

// Ширина колонки итогов
export const AGGREGATION_COLUMN_WIDTH = 70;

// FIXME: Не должно быть зашито ширины колонки под чекбокс, нужно как то переделать.
//  Опять же, контекст скролла это решает.
export const CHECKBOX_COLUMN_WIDTH = 20;
