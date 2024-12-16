/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
type TDatePopup = 'datePicker' | 'compactDatePicker' | 'shortDatePicker' | string;

export interface IDatePopupTypeOptions {
    datePopupType?: TDatePopup;
}

/**
 * Интерфейс выбора разных попапов в рамках одного вызывающего элемента.
 * @interface Controls/_date/interface/IDatePopupType
 * @public
 */

/**
 * @name Controls/_date/interface/IDatePopupType#datePopupType
 * @cfg {String} Календарь, который откроется при нажатии на вызывающий элемент
 * @remark Может принимать имя кастомного календаря, для этого укажите путь до компонента в виде строки.
 * Компонент получит поля startValue и endValue, начало и конец периода соответсвенно, в формате Date, либо null, если
 * период не выбран.
 * Для того чтобы отправить выбранный из календаря период в селектор, вызовите событие sendResult или воспользуйтесь
 * одноименным методом из контекста окон. В качестве аргумента передайте начало и конец периода.
 * @variant datePicker Большой выбор периода
 * @variant compactDatePicker Компактный выбор периода
 * @variant shortDatePicker Быстрый выбор периода
 * @default datePicker
 * @demo Controls-demo/Date/DatePopupType/Index
 */
