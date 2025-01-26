/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import type { TVisibility } from 'Controls/interface';
import {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
} from 'Controls-Lists/dynamicGrid';
import { Quantum, IQuantum } from 'Controls-Lists/_timelineGrid/utils';
import { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { IListLoadResult } from 'Controls/dataFactory';
import { TQuantsReplacementMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

/**
 * Видимость дополнительной колонки
 * @typedef {String} Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/TAggregationVisibility
 * @variant visible Колонка-агрегат видна
 * @variant hidden Колонка-агрегат скрыта
 */
export type TAggregationVisibility = Extract<TVisibility, 'visible' | 'hidden'>;

/**
 * Интерфейс временного периода.
 * Временной период - это например Год (12 мес), Полугодие (6 мес), Четверть (3 мес), Месяц (30 дней), Неделя (7 дней), День (24 часа)
 * Каждый временной период делится на соответствующие ему временные отрезки - {@link Controls-Lists/timelineGrid:Quantum кванты}
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange
 * @public
 */
export interface IRange {
    /**
     * Дата начала отображаемого периода
     */
    start: Date;
    /**
     * Дата окончания  отображаемого периода
     */
    end: Date;
    // TODO Убрать needScroll из range https://online.sbis.ru/opendoc.html?guid=4201154a-ce23-49a2-ba2b-9966ea7cf19d&client=3
    needScroll?: boolean;
}

/**
 * Интерфейс параметров курсорной навигации.
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/ITimelineColumnsNavigationSourceConfig
 * @public
 */
export interface ITimelineColumnsNavigationSourceConfig
    extends IDynamicColumnsNavigationSourceConfig<Date> {
    /**
     * Начальное значение курсора.
     */
    position?: Date;

    /**
     * Ограничение диапазона горизонтальной навигации. При указании начальной и/или конечной границы, навигация будет происходить только в указанных пределах
     * @demo Controls-Lists-demo/timelineGrid/WI/LimitedRange/Index
     */
    range?: IRange;
}

/**
 * Интерфейс параметров навигации по динамически генерируемым колонкам
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/ITimelineColumnsNavigation
 * @public
 */
export interface ITimelineColumnsNavigation extends IDynamicColumnsNavigation<Date> {
    /**
     * Параметры для курсорной навигации
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/ITimelineColumnsNavigationSourceConfig}
     */
    sourceConfig: ITimelineColumnsNavigationSourceConfig;
}

export interface IQuantumScaleFilter {
    quantum: Quantum;
    scale: number;
}

export interface ITimelineColumnsFilter<TPosition = Date>
    extends IDynamicColumnsFilter<TPosition>,
        IQuantumScaleFilter {}

/**
 * Параметры фабрики данных для "Таймлайн таблицы"
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments
 * @public
 * @example
 * <pre class="brush: js">
 * export getConfig() {
 *     return {
 *         EmployeeList: {
 *            dataFactoryName: 'Controls-Lists/timelineGrid:TimelineGridFactory',
 *            dataFactoryArguments: {
 *                source: {
 *                      // см. Работа с источником данных
 *                },
 *                keyProperty: 'key',
 *                parentProperty: 'parent',
 *                nodeProperty: 'type',
 *                root: null,
 *                navigation: {
 *                      // см. Работа с источником данных
 *                },
 *                columnsNavigation: {
 *                      // параметры поколоночной навигации (см. ниже)
 *                }
 *            },
 *         },
 *     };
 * }
 * </pre>
 */
export interface ITimelineGridDataFactoryArguments
    extends IDynamicGridDataFactoryArguments<Date, Date> {
    /**
     * Параметры горизонтальной навигации по колонкам.
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/ITimelineColumnsNavigation}
     * @example
     * В случае данного примера
     * <ol>
     *     <li>В фильтр будет добавлено поле dynamicColumnsData, содержащее данные курсора.</li>
     *     <li>Ожидается, что возвращаемые записи будут содержать поле dynamicColumnsData с данными динамических колонок.</li>
     * </ol>
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *    columnsNavigation: {
     *       sourceConfig: {
     *            field: 'dynamicColumnsData',
     *            direction: 'bothways',
     *            limit: '90',
     *            position: new Date(2023, 0, 1),
     *        },
     *    },
     * }
     * </pre>
     */
    columnsNavigation: ITimelineColumnsNavigation;
    /**
     * Диапазон дат для отображения периода.
     * Для того чтобы выбранный временной период сохранялся на сервисе параметров, необходимо указать параметр rangeHistoryId.
     * @remark
     * Стоит обратить внимание, что значение диапазона зависит от ширины видимой области и минимальной ширины колонок. Если указанный диапазон не умещается в заданную ширину, то будет посчитан и применён такой диапазон, чтобы все колонки уместились.
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange}
     * @example
     * <pre class="brush: js">
     * dataFactoryArguments: {
     *    range: {
     *        strart: new Date(),
     *        end: new Date(),
     *    },
     *    rangeHistoryId: 'timelineRangeHistory',
     * }
     * </pre>
     * @see Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent/IBaseDynamicGridComponentProps#viewportWidth viewportWidth
     * @see Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps#dynamicColumnMinWidths dynamicColumnMinWidths
     * @see rangeHistoryId
     */
    range: IRange;
    /**
     * Флаг, позволяющий включить автоматический подскролл к началу периода/началу активности после смены диапазона.
     * Компонент автоматически на основе переданных динамических событий решит, куда нужно проскроллить - к началу диапазона или к началу активности.
     */
    needScroll?: boolean;
    /**
     * Ключ в истории для сохранения последнего выбранного периода.
     * @cfg {String}
     * @see range
     */
    rangeHistoryId?: string;
    /**
     * Видимость дополнительной колонки
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/TAggregationVisibility.typedef}
     * @see Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps#aggregationRender
     * @see Controls-Lists/timelineGrid:useAggregationData
     */
    aggregationVisibility?: TAggregationVisibility;
    /**
     * Имя свойства строки данных, содержащего RecordSet с событиями.
     * Подробнее о настройке событий смотрите в {@link https://n.sbis.ru/article/e917f0a4-cb20-4c16-827d-b8723ad9ca8b базе знаний}
     * @cfg {String}
     * @see eventsProperty
     * @see eventStartProperty
     */
    eventsProperty?: string;
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату начала события
     * @cfg {String}
     * @see eventsProperty
     * @see eventEndProperty
     */
    eventStartProperty?: string;
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату окончания события
     * @cfg {String}
     * @see eventsProperty
     * @see eventStartProperty
     */
    eventEndProperty?: string;
    /**
     * Конфигурация календаря праздничных дней
     * @cfg {Controls-Lists/_timelineGrid/render/Holidays/IHolidaysConfig}
     */
    holidaysConfig?: IHolidaysConfig;
    /**
     * Настройка отображения квантов.
     * Позволяет указать доступные кванты и их масштабирование
     * @cfg
     * @demo Controls-Lists-demo/timelineGrid/WI/Scale/Index
     * @example
     * <pre class="brush: js">
     *    quantums: [
     *        {
     *            name: Quantum.QuarterHour,
     *        },
     *        {
     *            name: Quantum.HalfHour,
     *        },
     *        {
     *            name: Quantum.Hour
     *        },
     *        {
     *            name: Quantum.Day
     *            scales: [
     *                {
     *                    value: DayRange.Month
     *                },
     *                {
     *                    value: DayRange.Week
     *                }
     *            ]
     *        },
     *        {
     *            name: Quantum.Month
     *        }
     *  ]
     * </pre>
     */
    quantums?: IQuantum[];
}

export interface ITimelineGridLoadResult extends IListLoadResult {
    range: IRange;
    needScroll: boolean;
    quantsReplacementMap: TQuantsReplacementMap;
}
