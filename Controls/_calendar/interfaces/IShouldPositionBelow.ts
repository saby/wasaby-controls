/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */

export interface IShouldPositionBelowOptions {
    shouldPositionBelow?: boolean;
}

/**
 * Интерфейс для контролов-календарей, которые поддерживают позиционирование текущей или выбранной даты снизу
 *
 * @interface Controls/_calendar/interfaces/IShouldPositionBelow
 * @public
 */

/**
 * @name Controls/_calendar/interfaces/IShouldPositionBelow#shouldPositionBelow
 * @cfg {Boolean} Определяет, нужно ли позиционировать текущую или выбранную дату снизу.
 * @remark
 * Работает только в том случае, если если выбранная дата больше или равна текущей.
 * @demo Controls-demo/ShortDatePicker/ShouldPositionBelow/Index
 * @default false
 */
