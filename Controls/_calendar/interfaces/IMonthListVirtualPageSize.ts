/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */

/**
 * @public
 */
export interface IMonthListVirtualPageSizeOptions {
    virtualPageSize: number;
}

/**
 * Интерфейс для контролов, которые основаны на {@link Controls/calendar:MonthList} и поддерживающие изменение виртуальной страницы.
 * @public
 */
export interface IMonthListVirtualPageSize {
    readonly '[Controls/_calendar/interfaces/IMonthListVirtualPageSize]': boolean;
}

/**
 * @name Controls/_calendar/interfaces/IMonthListVirtualPageSize#virtualPageSize
 * @cfg {Number} Размер виртуальной страницы. Задаёт максимальное количество элементов, которые одновременно отображаются в списке.
 * @default 6
 */
