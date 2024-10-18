/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export interface IExtendedTimeFormatOptions {
    extendedTimeFormat: boolean;
}

/**
 * Интерфейс расширенного режима ввода времени в поле.
 * @interface Controls/_date/interface/IExtendedTimeFormat
 * @public
 */

/**
 * @name Controls/_date/interface/IExtendedTimeFormat#extendedTimeFormat
 * @cfg {Boolean} Определяет, включен ли расширенный режим.
 * @remark
 * Опция позволяет вводить пользователю '24:00'. При этом значение в формает Date будет 23:59:59.
 * @demo Controls-demo/Input/DateTime/DateTime
 */
