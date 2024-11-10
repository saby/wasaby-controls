/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export interface IPlaceholderOptions {
    placeholder: string;
}

/**
 * Интерфейс для контролов, которые поддерживают возможность подсказки в пустом поле ввода даты
 *
 * @interface Controls/_date/interface/IPlaceholder
 * @public
 */

/**
 * @name Controls/_date/interface/IPlaceholder#placeholder
 * @cfg {String} Подсказка в пустом поле ввода даты
 * @example
 * <pre>
 *  <Controls.date:Input value="{{ _value }}"
 *                       placeholder="Когда?"/>
 * </pre>
 * @demo Controls-demo/dateNew/Input/Placeholder/Index
 */
