/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { date as dateFormat } from 'Types/formatter';
import { descriptor } from 'Types/entity';
import { Base as dateUtil } from 'Controls/dateUtils';

/**
 * Интерфейс для контролов, которые отображают месяц.
 * @interface Controls/_calendar/interfaces/IMonth
 * @public
 */

type TMode = 'current' | 'extend';

export interface IMonthOptions {
    month?: Date;
    showCaption?: boolean;
    captionFormat?: string;
    showWeekdays?: boolean;
    dayFormatter?: (date: Date) => object;
    mode?: TMode;
}

export default {
    getDefaultOptions(): IMonthOptions {
        return {
            /**
             * Отображаемый месяц.
             * @name Controls/_calendar/interfaces/IMonth#month
             * @cfg {Date|String}
             * @remark
             * Строка должна быть формата ISO 8601.
             * Дата игнорируется.
             * @example
             * <pre class="brush: html">
             *     <option name="month">2015-03-07T21:00:00.000Z</option>
             * </pre>
             */
            month: dateUtil.getStartOfMonth(new Date()),

            /**
             * Видимость заголовка.
             * @name Controls/_calendar/interfaces/IMonth#showCaption
             * @cfg {Boolean}
             * @remark
             * Если опция установлена в значение true, то заголовок отображается.
             * Формат данных, отображаемых в заголовке, задается в опции {@link captionFormat}.
             * @default false
             * @see captionFormat
             * @see captionTemplate
             */
            showCaption: false,

            /**
             * Формат заголовка.
             * @name Controls/_calendar/interfaces/IMonth#captionFormat
             * @cfg {String}
             * @remark
             * Строка должна быть в формате поддерживаемым {@link Types/formatter:date}.
             * @default DD.MM.YY
             * @see showCaption
             * @see captionTemplate
             */
            captionFormat: dateFormat.FULL_MONTH,

            /**
             * Видимость подписей дней недели.
             * @name Controls/_calendar/interfaces/IMonth#showWeekdays
             * @cfg {Boolean}
             * @remark
             * Если опция установлена в значение true, то дни недели отображаются.
             * @default true
             */
            showWeekdays: true,

            /**
             * Коллбэк функция вызываемая перед отображением дня. Используется для переопределения стандартного отображения дня.
             * @name Controls/_calendar/interfaces/IMonth#dayFormatter
             * @cfg {Function}
             * @remark
             * Метод получает в аргумент объект даты.
             * Метод должен возвращать конфигурацию для отображения дня в виде объекта.
             * Возможные поля для конфигурации:
             *
             * * today - назначить число сегодняшней датой.
             * * readOnly - установить число в режим только для чтения.
             * * date - изменить дату.
             * * selectionEnabled - включить курсор при наведении на ячейку.
             * * weekend - назначить число выходным.
             * @default undefined
             * @demo Controls-demo/Calendar/MonthView/dayFormatter/Index
             */
            dayFormatter: undefined,

            /**
             * ENG
             * @typedef {String} Mode
             * @variant current Only the current month is displayed
             * @variant extended 6 weeks are displayed. The first week of the current month is complete,
             * the last week is complete and if the current month includes less than 6 weeks, then the weeks
             * of the next month are displayed.
             */

            /**
             * Режим отображения месяца.
             * @name Controls/_calendar/interfaces/IMonth#mode
             * @cfg {String}
             * @variant extended - расширенный режим, в котором будут отображены 6 недель
             * @variant current - отобразиться нынешний месяц
             * @default current
             */

            /**
             * ENG
             * Month view mode.
             * @name Controls/_calendar/interfaces/IMonth#mode
             * @cfg {String}
             * @demo Controls-demo/Calendar/MonthView/NewMode/Index
             * @default current
             */
            mode: 'current',

            /**
             * Шаблон заголовка дня.
             * @name Controls/_calendar/interfaces/IMonth#dayHeaderTemplate
             * @cfg {String|TemplateFunction}
             * @remark В шаблоне можно использовать объект value, в котором хранятся:
             *  <ul>
             *      <li>caption - сокращенное название дня недели</li>
             *      <li>day - индекс дня</li>
             *      <li>weekend - определяет, является ли день выходным</li>
             *  </ul>
             * @example
             * <pre class="brush: html">
             *  <Controls.calendar:MonthView bind:month="_month">
             *       <ws:dayHeaderTemplate>
             *          <ws:if data="{{!dayHeaderTemplate.value.weekend}}">
             *             <div class="controls-MonthViewDemo-day"> {{dayHeaderTemplate.value.caption}}</div>
             *          </ws:if>
             *          <ws:else>
             *             <div class="controls-MonthViewDemo-day-weekend"> {{dayHeaderTemplate.value.caption}}</div>
             *          </ws:else>
             *       </ws:dayHeaderTemplate>
             *  </Controls.calendar:MonthView>
             * </pre>
             */

            /**
             * Шаблон заголовка.
             * @name Controls/_calendar/interfaces/IMonth#captionTemplate
             * @cfg {String|TemplateFunction}
             * @remark В шаблоне можно использовать date (Дата месяца) caption (Заголовок месяца)
             * @example
             * <pre class="brush: html">
             *  <Controls.calendar:MonthView bind:month="_month">
             *       <ws:captionTemplate>
             *          <div>{{captionTemplate.caption}}</div>
             *       </ws:captionTemplate>
             *  </Controls.calendar:MonthView>
             *  </pre>
             * @see showCaption
             * @see captionFormat
             */

            /**
             * Массив данных, который используется для отображения дней.
             * @name Controls/_calendar/interfaces/IMonth#daysData
             * @cfg {Array<Object>}
             * @default undefined
             * @example
             * <pre class="brush: html">
             *  <Controls.calendar:MonthView daysData="{{ _daysArray }}">
             *       <ws:dayTemplate>
             *          {{ dayTemplate.value.doubledDay}}
             *       </ws:dayTemplate>
             *  </Controls.calendar:MonthView>
             *  </pre>
             *  <pre class="brush: js">
             *      ...
             *      _getArray() {
             *          const array = [];
             *          const amountOfDays = 31;
             *          for (let i = 0; i < amountOfDays; i ++) {
             *              array.push[{
             *                  doubledDay: i * 2
             *              }];
             *          }
             *          this._daysArray = array;
             *      }
             *      ...
             *  </pre>
             */
        };
    },

    getOptionTypes(): object {
        return {
            // month: types(Date),
            showCaption: descriptor(Boolean),
            captionFormat: descriptor(String),
            showWeekdays: descriptor(Boolean),
            dayFormatter: descriptor(Function),
            mode: descriptor(String).oneOf(['current', 'extended']),
        };
    },
};
