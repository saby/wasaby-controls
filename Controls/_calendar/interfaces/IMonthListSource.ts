/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { ICrud } from 'Types/source';
import { TemplateFunction } from 'UI/Base';

interface ISource extends ICrud {
    getInitialData?: Function;
}

export interface IMonthListSourceOptions {
    source?: ISource;
    order?: string;
    filter?: {};
    holidaysGetter?: {};
}
/* Eng
 * An interface for controls based on Controls/calendar:MonthList and allowing you to draw your data
 * on the cells of the month.
 * @interface Controls/_calendar/interfaces/IMonthListSource
 * @public
 */

/**
 * Интерфейс для контролов, которые основаны на {@link Controls/calendar:MonthList}.
 * Позволяет настраивать отображение дней в зависимости от прикладных данных.
 * @public
 */
export interface IMonthListSource {
    readonly '[Controls/_calendar/interfaces/IMonthListSource]': boolean;
}

/**
 * @name Controls/_calendar/interfaces/IMonthListSource#source
 * @cfg {Types/source:ICrud} Источник данных, которые используются для отображения дней.
 * @remark
 * Загрузка данных для календаря происходит асинхронно относительно отрисовки самого календаря. Это позволяет ускорить
 * работу для пользователя, если он намеренно скроллит к нужной дате и данные остальных месяцев для него не важны.
 * Данные не будут загружаться до тех пор, пока скролл не остановится.
 * source должен поддерживать списочный метод с навигацией по курсору.
 * В качестве правил фильтрации данных придет объект с полем id c датой в формате YYYY-MM-DD, с которого начинается загрузка.
 * Загрузка всегда происходит сверху вниз, т.е. начинается с более раннего месяца и заканчиается более поздним.
 * Данные закешируются и повторной загрузки не произайдет. После остановки скролла, календарь запросит данные только для
 * новых элементов.
 * В качестве максимального количества строк в выборке придет количество загружаемых месяцев. На это значение нельзя повлиять.
 * Каждый элемент — это месяц.
 * Ответ должен содержать список объектов, в котором есть поле extData. extData — это массив объектов, содержащих данные дня.
 * Каждый объект - это один день. Индекс объекта в массиве равен индексу дня в месяце.
 * Эти объекты будут переданы в шаблон дня.
 * Пример данных, который должен вернуть source в методе query:
 * <pre>
 *     [
 *       {
 *           id: '2019-09-01',
 *           extData: [
 *               {isMarked: true},
 *               {isMarked: false},
 *               ...
 *               {isMarked: true}
 *           ]
 *       }, {
 *           id: '2019-10-01',
 *           extData: [
 *               {isMarked: true},
 *               {isMarked: false},
 *               ...
 *               {isMarked: true}
 *           ]
 *       }
 *     ]
 * </pre>
 * Для того, чтобы календарь построился синхронно при первом построении, объявите в сорсе метод getInitialData.
 * Это коллбек-функция, которая должна возвращать предзагруженные данные в том же формате, что и сорс.
 * В качестве аргумента придет дата, с которой начинается загрузка данных
 * @example
 * <pre class="brush: html">
 *  <Controls.calendar:MonthList
 *      position="_month"
 *      source="{{_source}}">
 *     <ws:yearTemplate>
 *         <ws:partial template="Controls/calendar:MonthListYearTemplate">
 *            <ws:dayTemplate>
 *               <ws:partial template="Controls/calendar:MonthViewDayTemplate">
 *                  <ws:contentTemplate>
 *                     <div class="{{contentTemplate.value.extData.isMarked ? 'someClass'}}">
 *                        {{contentTemplate.value.day}}
 *                     </div>
 *                  </ws:contentTemplate>
 *               </ws:partial>
 *            </ws:dayTemplate>
 *         </ws:partial>
 *      </ws:yearTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 * @demo Controls-demo/CompactDatePicker/Source/Index
 */

/**
 * @name Controls/_calendar/interfaces/IMonthListSource#filter
 * @cfg {Object} Конфигурация объекта фильтра. Фильтр отправляется в запрос к источнику для получения данных дней.
 */

/**
 * @name Controls/_calendar/interfaces/IMonthListSource#getInitialData
 * @cfg {Function} Коллбек-функция, которая должна возвращать предзагруженные данные в том же формате, что и сорс.
 * В качестве аргумента придет дата, с которой начинается загрузка данных.
 * @demo Controls-demo/Calendar/MonthList/Source/GetInitialData/Index
 */

/**
 * @name Controls/_calendar/interfaces/IMonthListSource#order
 * @cfg {String} Направление сортировки
 * @default 'asc'
 * @remark Работает только если не задан заголовок
 * @variant 'asc' прямой порядок
 * @variant 'desc' обратный порядок
 * @example
 * <pre>
 * <Controls.calendar:MonthList
 *     bind:month="_month"
 *     order='desc'>
 *     <ws:dayTemplate>
 *         <ws:partial template="Controls/calendar:MonthViewDayTemplate">
 *             <ws:contentTemplate>
 *                 <ws:partial template="{{_dayTemplate}}"/>
 *             </ws:contentTemplate>
 *         </ws:partial>
 *     </ws:dayTemplate>
 * </Controls.calendar:MonthList>
 * </pre>
 * @noShow
 */

/**
 * @name Controls/_calendar/interfaces/IMonthListSource#holidaysGetter
 * @cfg {Object} Контроллер для настройки выходных дней в календаре.
 * @remark
 * Контроллер должен описывать метод getHolidays, аргументами которого будут является startValue и endValue, где
 * startValue - начало периода загрузки данных, enValue - конец периода загрузки данных. Метод возвращает Promise,
 * результатом которого должен быть Recordset, каждый элемент имеет два поля:
 * id - индификатор месяца в формате 'YYYY-MM-DD'
 * holidaysData - массив булевых значений для каждого дня, где true это выходной день, а false рабоий.
 * Пример данных, который должен вернуть getHolidays:
 * <pre>
 *     [
 *       {
 *           id: '2019-09-01',
 *           holidaysData: [
 *               false,
 *               true,
 *               true,
 *               true,
 *               ...
 *               false
 *           ]
 *       }, {
 *           id: '2019-10-01',
 *           holidaysData: [
 *               true,
 *               true,
 *               false,
 *               false,
 *               ...
 *               false
 *           ]
 *       }
 *     ]
 * </pre>
 */
