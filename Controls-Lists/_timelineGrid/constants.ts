/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
// Первый час суток - 0
export const START_DAY_HOUR = 0;

// Последний час суток - 23. Потому что 23:00-24:00
export const END_DAY_HOUR = 23;

// Макисмально возможное кол-во дней в месяце
export const DAYS_IN_MONTH = 31;

// Макисмально возможное кол-во дней для выбора, дальше выбор идет по месяцам
export const DAYS_IN_TWO_MONTHS = DAYS_IN_MONTH * 2;

// Число месяцев в году
export const MONTHS_IN_YEAR = 12;

// Число месяцев в полугодии
export const MONTHS_IN_HALFYEAR = 6;

// Число месяцев в квартале
export const MONTHS_IN_QUARTER = 3;

// Число часов в сутках
export const HOURS_IN_DAY = 24;

// Минимальная ширина динамической колонки для расширенного отображения данных
export const ADVANCED_DATA_COLUMN_WIDTH = 50;

// Число дней в неделе
export const DAYS_IN_WEEK = 7;

// Продолжительность дня в милисекундах.
export const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Коорроектировка под часовой пояс Москвы
export const DIFF_UTC_MSK = -180;

// минут в половине часа
export const MINUTES_IN_HALF_HOUR = 30;

// минут в четверти часа
export const MINUTES_IN_QUARTER_HOUR = 15;

// Четверть
export const QUARTER = 4;

// Половина
export const HALF = 2;

// Число недель в месяце
export const WEEKS_IN_MONTH = 4;

// Число недель в квартале
export const WEEKS_IN_QUARTER = WEEKS_IN_MONTH * QUARTER;

// Число лет, отображаемых в квантах год по умолчанию
export const YEARS_BY_DEFAULT = 1;
