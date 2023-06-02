/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
type TDatePopup = 'datePicker' | 'compactDatePicker' | 'shortDatePicker';

export interface IDatePopupTypeOptions {
    datePopupType: TDatePopup;
}

/**
 * Интерфейс выбора разных попапов в рамках одного вызывающего элемента.
 * @interface Controls/_date/interface/IDatePopupType
 * @public
 */

/**
 * @name Controls/_date/interface/IDatePopupType#datePopupType
 * @cfg {String} Календарь, который откроется при нажатии на вызывающий элемент
 * @variant datePicker Большой выбор периода
 * @variant compactDatePicker Компактный выбор периода
 * @variant shortDatePicker Быстрый выбор периода
 * @default datePicker
 * @demo Controls-demo/Date/DatePopupType/Index
 */
