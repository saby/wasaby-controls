export interface IDayAvailableOptions {
    isDayAvailable: (date: Date) => boolean;
}

/**
 * Интерфейс для контролов, которые позволяют устанавливать запрет на выбор конкретных дней в календаре.
 * @interface Controls/_calendar/interfaces/IDayAvailable
 * @public
 */
export default interface IDayAvailable {
    readonly '[Controls/_calendar/interfaces/IDayAvailable]': boolean;
}

/**
 * @name Controls/_calendar/interfaces/IDayAvailable#isDayAvailable
 * @cfg {Function} Коллбек-функция, которая определяет, может ли пользователь выбирать конкретный день.
 * @remark
 * Функция должна возвращать булевое значение.
 * Формат функции обратного вызова (date: Date, extData?: Model) => bool
 * Если задан источник данных - вторым аргументом в коллбек-функцию придет модель данных даты.
 * @example
 * <pre>
 *     <Controls.dateRange:Selector
 *          bind:startValue="_startValue"
 *          bind:endValue="_endValue"
 *          isDayAvailable="{{ _isDayAvailable }}"
 *     />
 * </pre>
 * <pre>
 *     protected _isDayAvailable(date: Date): boolean {
 *      // Заблокируем выбор всех понедельников и четвергов
 *      return date.getDay() !== 1 && date.getDay() !== 4;
 *  }
 * </pre>
 * @demo Controls-demo/dateRange/RangeSelector/IsDayAvailable/Index
 */
