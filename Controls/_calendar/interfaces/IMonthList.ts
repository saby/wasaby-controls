/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { TemplateFunction } from 'UI/Base';

export interface IMonthListOptions {
    viewMode: string;
    position?: Date;
    customTemplate?: TemplateFunction;
    yearTemplate?: TemplateFunction;
    monthTemplate?: TemplateFunction;
    dayTemplate?: TemplateFunction;
    dayHeaderTemplate?: TemplateFunction;
    captionTemplate?: TemplateFunction;
    stubTemplate?: TemplateFunction;
    displayedRanges?: [];
    shouldPositionBelow?: boolean;
    amountOfCustomItems?: number;
}

/**
 * Интерфейс для контролов, которые основаны на {@link Controls/calendar:MonthList}.
 * @public
 */
export interface IMonthList {
    readonly '[Controls/_calendar/interfaces/IMonthList]': boolean;
}

/**
 * @typedef {String} ViewMode
 * @variant year Один отображаемый элемент — год.
 * @variant month Один отображаемый элемент — месяц.
 * @variant custom Один отображаемый элемент опеределяется опцией {@link Controls/_calendar/interfaces/IMonthList#amountOfCustomItems}
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#viewMode
 * @cfg {ViewMode} Режим отображения элементов.
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList
 *     bind:position="_month"
 *     viewMode="month"/>
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#yearTemplate
 * @see Controls/_calendar/interfaces/IMonthList#monthTemplate
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#amountOfCustomItems
 * @cfg {Number} Число элементов, на которые будет поделено отображение одного года в календаре
 * @remark
 * Если указать значение 2 - один год будет состоять из 2 элементов по 6 месяцев.
 * Если указать значение 3 - одни год будет составлять 3 элемента по 4 месяца и т.д.
 * Для кооректной работы нужно указать в опцию {@link Controls/_calendar/interfaces/IMonthList#viewMode} значение
 * custom
 * @see Controls/_calendar/interfaces/IMonthList#customTemplate
 */

/**
 * @typedef {String} ShadowVisibility
 * @variant visible Тень всегда видима.
 * @variant hidden Тень всегда скрыта.
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#topShadowVisibility
 * @cfg {ShadowVisibility} Устанавливает режим отображения тени сверху.
 * @default visible
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList topShadowVisibility="hidden"/>
 * </pre>
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#bottomShadowVisibility
 * @cfg {ShadowVisibility} Устанавливает режим отображения тени снизу.
 * @default visible
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList bottomShadowVisibility="hidden"/>
 * </pre>
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#position
 * @cfg {Date} Год или месяц, который отображается первым в верху скролируемой области.
 * При изменении значения лента скролится к новому году\месяцу.
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList bind:position="_month"/>
 * </pre>
 */

/**
 * @name Controls/_calendar/interface/IMonthList#displayedRanges
 * @cfg {Array} Массив отображаемых периодов. Каждый элемент — это массив, который содержит начало и конец периода.
 * @remark
 * Позволяет ограничить отображаемые периоды в ленте. На месте остальных промежутков будут отображаться заглушки
 * {@link stubTemplate}. Если опция не задана, то лента бесконечно скролится в обе стороны. Для того чтобы
 * сконфигурировать бесконечный скролл в одном из направлений, соответствующая граница задается как null.
 * @example
 * Отображаем два периода. С минус бесконечности до декабря 16 и с января 18 до декабрь 18. Ленту можно проскроллить
 * максимум до декабря 18. Между 16 и 18 годом бует отображаться одна загрушка {@link stubTemplate} вместо 12 месяцев.
 * <pre class="brush: js">
 * _displayedRanges: [[null, new Date(2016, 11)], [new Date(2018, 0), new Date(2018, 11)]]
 * </pre>
 * <pre class="brush: html">
 * <Controls.calendar:MonthList
 *    viewMode="month"
 *    displayedRanges="_displayedRanges" />
 * </pre>
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#yearTemplate
 * @cfg {String|TemplateFunction} Шаблон года.
 * @remark
 * Отображается только в режиме года(viewMode: 'year'). В качестве опций получает date(дата начала года) и
 * extData(данные загруженные через источник данных). extData представляет из себя массив, содержащий месяцы.
 * Каждый месяц это массив содержащий данные дня загруженные через источник данных.
 *
 * @default Controls/calendar:MonthListYearTemplate
 *
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList>
 *     <ws:yearTemplate>
 *         <ws:partial template="Controls/calendar:MonthListYearTemplate">
 *            <ws:dayTemplate>
 *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
 *                  <ws:contentTemplate>
 *                     <div class="{{contentTemplate.value.extData.isEven ? 'someClass'}}">
 *                        {{contentTemplate.value.day}}
 *                     </div>
 *                  </ws:contentTemplate>
 *               </ws:partial>
 *            </ws:dayTemplate>
 *         </ws:partial>
 *      </ws:yearTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#monthTemplate
 * @see Controls/_calendar/interfaces/IMonthList#viewMode
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#customTemplate
 * @cfg {String|TemplateFunction} Кастомный шаблон.
 * @remark
 * Отображается только в режиме custom (viewMode: 'custom'). В качестве опций получает date(дата начала года) и
 * extData(данные загруженные через источник данных).
 *
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList viewMode="custom" amountOfCustomItems="4">
 *     <ws:customTemplate>
 *         <Controls.calendar:MonthView month="{{ _getMonth(customTemplate.data.date, 0) }}"/>
 *         <Controls.calendar:MonthView month="{{ _getMonth(customTemplate.data.date, 1) }}"/>
 *         <Controls.calendar:MonthView month="{{ _getMonth(customTemplate.data.date, 2) }}"/>
 *      </ws:customTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#amountOfCustomItems
 */

/**
 * @name Controls/_calendar/interfaces/IMonthList#monthTemplate
 * @cfg {String|TemplateFunction} Шаблон месяца.
 *
 * @remark
 * В качестве опций получает date (дата начала месяца) и extData (данные, загруженные через источник данных).
 * extData представляет из себя массив из объектов, содержащих данные дня, загруженные через источник данных.
 *
 * @default Controls/calendar:MonthListMonthTemplate
 *
 * @example
 * <pre class="brush: html">
 * <Controls.calendar:MonthList>
 *     <ws:monthTemplate>
 *         <ws:partial template="Controls/calendar:MonthListMonthTemplate">
 *            <ws:dayTemplate>
 *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
 *                  <ws:contentTemplate>
 *                     <div class="{{contentTemplate.value.extData.isEven ? 'someClass'}}">
 *                        {{contentTemplate.value.day}}
 *                     </div>
 *                  </ws:contentTemplate>
 *               </ws:partial>
 *            </ws:dayTemplate>
 *         </ws:partial>
 *      </ws:monthTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 * @see Controls/_calendar/interfaces/IMonthList#yearTemplate
 * @see Controls/_calendar/interfaces/IMonthList#viewMode
 */

/**
 * @name Controls/_calendar/interface/IMonthList#stubTemplate
 * @cfg {String|TemplateFunction} Шаблон заглушки, которая рисуется между отображаемыми периодами {@link displayedRanges}.
 *
 * @remark
 * В качестве опций получает startValue и endValue — даты начала и конца не отображаемого периода.
 *
 * @default Controls/calendar:MonthListStubTemplate
 *
 * @example
 * Отображаем 2 периода. Между декабрем 2016 и январем 2018 года вместо 12 месяцев будет отображена одна ззаглушка.
 * <pre class="brush: js">
 * _displayedRanges: [[null, new Date(2016, 11)], [new Date(2018, 0), new Date(2019, 0)]]
 * </pre>
 * <pre class="brush: html">
 * <Controls.calendar:MonthList viewMode="month">
 *     <ws:stubTemplate>
 *         <div>
 *             {{startValue}} - {{endValue}}
 *         </div>
 *      </ws:stubTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 *
 * @see Controls/_calendar/interface/IMonthList#displayedRanges
 */

/**
 * @event enrichItems Происходит после  отрисовки элементов с новыми загруженными данными.
 * @name Controls/_calendar/interface/IMonthList#enrichItems
 * @example
 * В этом примере производим некоторые манипуляции с элементами, после того, как загрузились новые данные, и элементы перерисовались.
 * <pre class="brush: js">
 * protected _enrichItemsHandler() {
 *     this._doSomeStuffWithItems();
 * }
 * </pre>
 * <pre class="brush: html">
 * <Controls.calendar:MonthList on:enrichItems="_enrichItemsHandler()"/>
 * </pre>
 */
