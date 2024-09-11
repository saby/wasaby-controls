import { CrudEntityKey } from 'Types/source';

export type TPeriod = 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year';

type TPeriodType = 'last' | 'current';

export interface IUserPeriod {
    /**
     * @cfg {CrudEntityKey} Идентификатор пункта меню
     */
    key: CrudEntityKey;
    value?: Date | Date[];
    /**
     * @cfg {String} Текст пункта меню
     */
    title: string;
    /**
     * @cfg {Number} Порядок пункта в списке. По умолчанию пункт добавляется в конец списка, перед пунктом "За период/На дату".
     * Используйте, если необходимо добавить период между платформенными пунктами. Платформенные пункты начинаются со значения 10 и имеют шаг 10.
     * Т.е. Сегодня - 10, завтра - 20, неделя - 30 и т.д.
     */
    order?: number;
}

/**
 * Интерфейс для редакторов даты, используемых в фильтрах
 *
 * @interface Controls/filter:IPeriodsConfig
 * @public
 */
export interface IPeriodsConfig {
    /**
     * @name Controls/filter:IPeriodsConfig#periodType
     * @cfg {'last' | 'current'} Тип выбираемого периода
     * @variant current за текущий период
     * @variant last за последний период
     * @default current
     */
    periodType?: TPeriodType;
    /**
     * @name Controls/filter:IPeriodsConfig#excludedPeriods
     * @cfg {TExcludedPeriod[]} Периоды, которые требуется исключить из быстрого выбора
     */
    excludedPeriods?: TPeriod[];
    /**
     * @name Controls/filter:IPeriodsConfig#timePeriods
     * @cfg {Boolean} Добавляет дополнительные периоды, позволяющие фильтровать по маленькому интервалу времени.
     * Будут добавлены пункты со значениями: "Мунита", "5 минут", "30 минут", "Час".
     * @default false
     */
    timePeriods?: boolean;
    /**
     * @name Controls/filter:IPeriodsConfig#customPeriod
     * @cfg {Boolean} Добавляет пункт для выбора произвольного периода
     */
    customPeriod?: boolean;
    /**
     * @name Controls/filter:IPeriodsConfig#userPeriods
     * @cfg {IUserPeriod[]} Пользовательские периоды, будут добавлены как пункты меню
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
     *
     * 	   return [dateFrom, dateTo];
     * }
     * </pre>
     */
    userPeriods?: IUserPeriod[];
    /**
     * @name Controls/filter:IPeriodsConfig#valueMode
     * @cfg {String} Значение периода, которое уходит в метод БЛ и хранится в истории
     * @variant stringConstant значение уйдёт в виде строковой константы
     * @variant dates значение уйдет в виде массива дат [dateTo, dateFrom]
     * @default stringConstant
     */
    valueMode?: 'stringConstant' | 'dates';
    selectionType?: string;
}
