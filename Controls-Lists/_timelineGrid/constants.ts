/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
// Первый час суток - 0
export const START_DAY_HOUR = 0;
// Последний час суток - 23. Потому что 23:00-24:00
export const END_DAY_HOUR = 23;

// Макисмально возможное кол-во дней для выбора, дальше выбор идет по месяцам
export const DAYS_COUNT_LIMIT = 62;

// Макисмально возможное кол-во дней в месяце
export const ONE_MONTH = 31;

// Число месяцев в году
export const MONTHS_COUNT = 12;

// Число месяцев в квартале
export const QUARTER = 3;

// Число часов в сутках
export const HOURS_COUNT = 24;

// Минимальная ширина динамической колонки для расширенного отображения данных
export const ADVANCED_DATA_COLUMN_WIDTH = 50;

// Минимальная ширина динамической колонки по умолчанию
export const DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH = 20;

// Число дней в неделе
export const DAYS_IN_WEEK = 7;

// Продолжительность дня в милисекундах.
export const DAY_IN_MS = 24 * 60 * 60 * 1000;
