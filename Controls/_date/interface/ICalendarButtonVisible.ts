/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export interface ICalendarButtonVisibleOptions {
    calendarButtonVisible: boolean;
}

/**
 * Интерфейс для контролов, которые имеют возможность отключения видимости иконки рядом с полем ввода, которая вызывает попап
 *
 * @interface Controls/_date/interface/ICalendarButtonVisible
 * @public
 */

/**
 * @name Controls/_date/interface/ICalendarButtonVisible#calendarButtonVisible
 * @cfg {Boolean} Определяет видимость иконки, открывающей попап выбора периода.
 * @remark
 * Если иконку не видно, попап выбора периода будет открываться по клику на поле ввода.
 * @default true
 * @demo Controls-demo/dateRange/Input/CalendarButtonVisible/Index
 */
