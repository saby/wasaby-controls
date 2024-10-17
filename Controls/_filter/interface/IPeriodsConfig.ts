import { CrudEntityKey } from 'Types/source';
import type { TSelectionType } from 'Controls/dateRange';

export type TPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year';

export type TPeriodType = 'last' | 'current';

/**
 * Интерфейс пользовательского периода
 * @public
 */
export interface IUserPeriod {
    /**
     * Идентификатор пункта меню
     */
    key: CrudEntityKey;
    /**
     * Текст пункта меню
     */
    title: string;
    /**
     * Порядок пункта в списке. По умолчанию пункт добавляется в конец списка, перед пунктом "За период/На дату".
     * Используйте, если необходимо добавить период между платформенными пунктами. Платформенные пункты начинаются со значения 10 и имеют шаг 10.
     * Т.е. Сегодня - 10, завтра - 20, неделя - 30 и т.д.
     */
    order?: number;
    /**
     * Функция получения периода. В результате ожидается массив двух дат.
     */
    getValueFunctionName: Function;
}

/**
 * Интерфейс для контролов фильтра с быстрым выбором периода из меню
 * @public
 */
export interface IPeriodsConfig {
    /**
     * @typedef {String} TPeriodType
     * @description Тип выбираемого периода
     * @variant last период в прошлое от текущей даты
     * @variant current текущий календарный период (например неделя с понедельника по воскресенье)
     */
    /**
     * @name Controls/filter:IPeriodsConfig#periodType
     * @cfg {TPeriodType} Тип выбираемого периода
     * @default current
     * @example
     * Пример настройки для {@link Controls/filterPanelEditors:DateMenu редактора фильтра}
     * <pre class="brush: js">
     *      const filterDescription = [{
     * 	        name: 'period'
     * 	        value: null,
     * 	        resetValue: null,
     * 	        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     * 	        descriptionToValueConverter: 'Controls/filter:getDatesByFilterItem',
     * 	        editorOptions: {
     * 		        periodType: 'last'
     * 	        }
     * }];
     * </pre>
     * Пример настройки для {@link Controls-ListEnv/CountFilter фильтра по счётчику}
     * <pre class="brush: js">
     *      <CountFilter
     *          storeId="rating"
     *          periodType="last"
     *          ...
     *      />
     * </pre>
     */
    periodType?: TPeriodType;
    /**
     * @typedef {String} TPeriod
     * @description Ключи элементов меню быстрого выбора периода
     * @variant today
     * @variant yesterday
     * @variant week
     * @variant month
     * @variant quarter
     * @variant year
     */
    /**
     * @name Controls/filter:IPeriodsConfig#excludedPeriods
     * @cfg {Array.<TPeriod>} Периоды, которые требуется исключить из быстрого выбора
     * @example
     * Пример настройки для {@link Controls/filterPanelEditors:DateMenu редактора фильтра}
     * <pre class="brush: js">
     *      const filterDescription = [{
     * 	        name: 'period'
     * 	        value: null,
     * 	        resetValue: null,
     * 	        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     * 	        descriptionToValueConverter: 'Controls/filter:getDatesByFilterItem',
     * 	        editorOptions: {
     * 		        excludedPeriods: ['quarter', 'year']
     * 	        }
     * }];
     * </pre>
     * Пример настройки для {@link Controls-ListEnv/CountFilter фильтра по счётчику}
     * <pre class="brush: js">
     *      <CountFilter
     *          storeId="rating"
     *          excludedPeriods={['quarter', 'year']}
     *          ...
     *      />
     * </pre>
     */
    excludedPeriods?: TPeriod[];
    /**
     * @name Controls/filter:IPeriodsConfig#timePeriods
     * @cfg {Boolean} Добавляет дополнительные периоды, позволяющие фильтровать по маленькому интервалу времени.
     * Будут добавлены пункты со значениями: "Минута", "5 минут", "30 минут", "Час".
     * @default false
     * @example
     * Пример настройки для {@link Controls/filterPanelEditors:DateMenu редактора фильтра}
     * <pre class="brush: js">
     *      const filterDescription = [{
     * 	        name: 'period'
     * 	        value: null,
     * 	        resetValue: null,
     * 	        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     * 	        descriptionToValueConverter: 'Controls/filter:getDatesByFilterItem',
     * 	        editorOptions: {
     * 		        timePeriods: true
     * 	        }
     * }];
     * </pre>
     * Пример настройки для {@link Controls-ListEnv/CountFilter фильтра по счётчику}
     * <pre class="brush: js">
     *      <CountFilter
     *          storeId="rating"
     *          timePeriods={true}
     *          ...
     *      />
     * </pre>
     */
    timePeriods?: boolean;
    /**
     * @name Controls/filter:IPeriodsConfig#customPeriod
     * @cfg {Boolean} Добавляет пункт для выбора произвольного периода
     * @default false
     * @example
     * Пример настройки для {@link Controls/filterPanelEditors:DateMenu редактора фильтра}
     * <pre class="brush: js">
     *      const filterDescription = [{
     * 	        name: 'period'
     * 	        value: null,
     * 	        resetValue: null,
     * 	        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     * 	        descriptionToValueConverter: 'Controls/filter:getDatesByFilterItem',
     * 	        editorOptions: {
     * 		        customPeriod: true
     * 	        }
     * }];
     * </pre>
     * Пример настройки для {@link Controls-ListEnv/CountFilter фильтра по счётчику}
     * <pre class="brush: js">
     *      <CountFilter
     *          storeId="rating"
     *          customPeriod={true}
     *          ...
     *      />
     * </pre>
     * @defaultValue false
     */
    customPeriod?: boolean;
    /**
     * @name Controls/filter:IPeriodsConfig#userPeriods
     * @cfg {IUserPeriod[]} Пользовательские периоды, которые будут добавлены как пункты меню
     * @example
     * <pre>
     * const myPeriods = [
     *    {
     * 		id: 'twoYears',
     * 		title: 'За последние два года',
     * 		getValueFunctionName: 'MyModule/myLib:getDatesValue'
     * 	}
     * ];
     * const filterDescription = [{
     * 	name: 'period'
     * 	value: null,
     * 	resetValue: null,
     * 	editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     * 	descriptionToValueConverter: 'Controls/filter:getDatesByFilterItem',
     * 	editorOptions: {
     * 		periodsConfig: {
     * 			type: 'last',
     * 			userPeriods: myPeriods,
     * 		},
     * 	}
     * }];
     * </pre>
     *
     * MyModule/myLib:getDatesValue
     * <pre>
     * export function getDatesValue(): [Date, Date] {
     * 	   const dateFrom = new Date();
     * 	   dateFrom.setFullYear(dateFrom.getFullYear() - 2);
     * 	   const dateTo = new Date();
     *st
     * 	   return [dateFrom, dateTo];
     * }
     * </pre>
     */
    userPeriods?: IUserPeriod[];
    selectionType?: TSelectionType;
}
