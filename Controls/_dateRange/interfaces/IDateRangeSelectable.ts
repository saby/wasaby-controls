/**
 * @kaizen_zone 98febf5d-f644-4802-876c-9afd0e12cf6a
 */
import coreMerge = require('Core/core-merge');
import entity = require('Types/entity');
import IRangeSelectable from './IRangeSelectable';

export type TSelectionType = 'range' | 'single' | 'quantum' | 'disable';

export interface IRangeSelectableOptions {
    selectionType: TSelectionType;
}

export interface IDateRangeSelectableOptions {
    ranges: {
        [key: string]: number[];
    };
}

/**
 * Интерфейс для выбора диапазона дат.
 * @interface Controls/_dateRange/interfaces/IDateRangeSelectable
 * @public
 */
const selectionTypes = coreMerge({ quantum: 'quantum' }, IRangeSelectable.SELECTION_TYPES);
const minRange = {
    day: 'day',
    month: 'month',
};

export = {
    getDefaultOptions() {
        const options = IRangeSelectable.getDefaultOptions();

        /**
         * @typedef {Object} Controls/_dateRange/interfaces/IDateRangeSelectable/Ranges
         * @description Конфигурация диапазонов дат. Используется в опции {@link Controls/_dateRange/interfaces/IDateRangeSelectable#ranges ranges}.
         * @property {Array.<number>} days Диапазоны дней.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "days: [2,5]" означает, что в контроле можно выбрать диапазон из 2 дней, либо из 5.
         * @property {Array.<number>} weeks Диапазоны недель.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "weeks: [2,5]" означает, что в контроле можно выбрать диапазон из 2 недель, либо из 5.
         * @property {Array.<number>} months Диапазоны месяцев.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "months: [2,5]" означает, что в контроле можно выбрать диапазон из 2 месяцев, либо из 5.
         * @property {Array.<number>} quarters Диапазоны кварталов.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "quarters: [2,5]" означает, что в контроле можно выбрать диапазон из 2 кварталов, либо из 5.
         * @property {Array.<number>} halfyears Диапазоны полугодий.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "halfyears: [2,5]" означает, что в контроле можно выбрать диапазон из 2 полугодий, либо из 5.
         * @property {Array.<number>} years Диапазоны лет.
         * Каждый элемент массива — натуральное число, которое задает диапазон.
         * Например, "years: [2,5]" означает, что в контроле можно выбрать диапазон из 2 лет, либо из 5.
         */

        /**
         * @name Controls/_dateRange/interfaces/IDateRangeSelectable#ranges
         * @cfg {Controls/_dateRange/interfaces/IDateRangeSelectable/Ranges.typedef} Диапазон дат, который доступен для выбора.
         * @remark
         * Использование опции актуально, когда опция {@link selectionType} установлена в значение "quantum".
         * @default {}
         * @example
         * В данном примере можно выбрать либо 1 день, либо диапазон в 4 дня, либо 2 целые недели, либо 1 месяц.
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.dateRange:Selector ranges="{{ _ranges }}" />
         * </pre>
         * <pre class="brush: js">
         * // TypeScript
         * _beforeMount(): void {
         *     this._ranges = {days: [1,4], weeks: [2], months: [1] }
         * }
         * </pre>
         */
        options.ranges = {};

        /**
         * @name Controls/_dateRange/interfaces/IDateRangeSelectable#selectionType
         * @cfg {String} Режим выделения диапазона дат.
         * @variant range Выделение произвольного диапазона дат.
         * @variant single Выделение только одной даты.
         * @variant quantum Выделение ограниченного диапазона дат. Конфигурация такого диапазона задается в опции {@link ranges}.
         * @variant disable Выбор диапазона дат отключен.
         * @demo Controls-demo/datePopup/SelectionType/Index
         * @default quantum
         */

        /**
         * @name Controls/_dateRange/interfaces/IDateRangeSelectable#minRange
         * @cfg {String} Режим выбора диапазона дат.
         * @variant day Выбор периода из нескольких дней.
         * @variant month Выбор периода из нескольких месяцев.
         * @default day
         */

        /**
         * @name Controls/_dateRange/interfaces/IDateRangeSelectable#rangeSelectedCallback
         * @cfg {Function} Функция обратного вызова для определения отображаемого диапазона дат и выбора дат из выпадающей панели.
         * @remark
         * Функция вызывается во время начала ввода периода, конца ввода периода, во время передвижения курсора по календарю,
         * во время переходов к следующему/предыдущему диапазону (кликам по стрелкам).
         * Функция принимает 3 аргумента:
         * startValue — Начальное значение диапазона.
         * endValue — Конечное значение диапазона.
         * baseValue - Значение, с которого начался выбор периода.
         * Если используются кванты, то в функцию будут передан рассчитанный по квантам диапазон.
         * Возвращаемым значением функции должен быть массив с двумя элементами, начальным и конечным значением диапазона [startValue, endValue].
         * @example
         * <pre class="brush: html">
         * <!-- WML -->
         * <Controls.dateRange:Selector rangeSelectedCallback="{{_rangeSelectedCallback}}" />
         * </pre>
         * <pre class="brush: js">
         * // TypeScript
         * ...
         * private _rangeSelectedCallback(startValue: Date, endValue: Date): Date[] {
         *    return [new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate() + 2),
         *        new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() + 4)];
         * }
         * ...
         * </pre>
         */

        /*
         * @name Controls/_dateRange/interfaces/IDateRangeSelectable#minRange
         * @cfg {String} Specifies the range selection mode
         * @variant 'day' selection mode period multiple days
         * @variant 'month' selection mode period multiple months
         */
        options.minRange = minRange.day;

        return options;
    },

    SELECTION_TYPES: selectionTypes,

    minRange,

    getOptionTypes() {
        const optionsTypes = IRangeSelectable.getOptionTypes();
        optionsTypes.selectionType = entity.descriptor(String).oneOf(Object.keys(selectionTypes));
        return optionsTypes;
    },
};
