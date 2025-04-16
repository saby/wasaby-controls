/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */

/**
 * Интерфейс для контролов, которые поддерживают покраску выходных дней
 * @interface Controls/_calendar/interfaces/IEnableWeekends
 * @public
 */

export interface IEnableWeekendsOptions {
    /**
     * @name Controls/_calendar/interfaces/IEnableWeekends#enableWeekends
     * @cfg {Boolean} Определяет, будут ли выходные дни иметь цвет отличный от обычных дней.
     */
    enableWeekends?: boolean;
}
