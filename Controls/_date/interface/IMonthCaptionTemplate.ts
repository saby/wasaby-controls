/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export default interface IMonthCaptionTemplate {
    readonly '[Controls/_date/interface/IMonthCaptionTemplate]': boolean;
}

export interface IMonthCaptionTemplateOptions {
    monthCaptionTemplate?: HTMLElement;
}

/**
 * Интерфейс для контролов ввода или выбора дат, которые поддерживают шаблон заголовка месяца.
 *
 * @interface Controls/_date/interface/IMonthCaptionTemplate
 * @public
 */

/**
 * @name Controls/_date/interface/IMonthCaptionTemplate#monthCaptionTemplate
 * @cfg {HTMLElement} Шаблон заголовка месяца.
 * @remark
 * В шаблон передается:
 * <ul>
 *     <li>caption - месяц в текстовом формате (Май, Июнь, Июль и т.д).</li>
 *     <li>date - дата месяца.</li>
 * </ul>
 * Опции шаблона:
 * <ul>
 *     <li>caption: Текст заголовка месяца.</li>
 *     <li>icon: Определяет {@link https://wi.sbis.ru/icons/ иконку}, которая будет отображена рядом с заголовком месяца.</li>
 *     <li>iconStyle: {@link https://wi.sbis.ru/docs/js/Controls/interface/IFontColorStyle/typedefs/TFontColorStyle/ Цвет} иконки.</li>
 * </ul>
 * @example
 * <pre>
 *     <Controls.date:Selector>
 *        <ws:monthCaptionTemplate>
 *          <ws:partial template="Controls/date:MonthCaptionTemplate" icon="icon-Yes" iconStyle="{{_getIconStyle(monthCaptionTemplate.month)}}"/>
 *        </ws:monthCaptionTemplate>
 *     </Controls.date:Selector>
 * </pre>
 * @demo Controls-demo/dateRange/DateSelector/MonthCaptionTemplate/Index
 */
