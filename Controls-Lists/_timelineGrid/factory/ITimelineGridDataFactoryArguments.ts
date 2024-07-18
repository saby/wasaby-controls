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
import { TQuantumScaleMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

/**
 * Видимость дополнительной колонки
 * @typedef {String} Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/TAggregationVisibility
 * @variant visible Колонка-агрегат видна
 * @variant hidden Колонка-агрегат скрыта
 */
export type TAggregationVisibility = Extract<TVisibility, 'visible' | 'hidden'>;

/**
 * Интерфейс объекта, содержащего диапазон дат отображаемого периода.
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
    /**
     * Флаг, позволяющий включить или отключить автоматический подскролл после текущей смены диапазона.
     * Компонент автоматически на основе переданных динамических событий решит, куда нужно проскроллить - к началу диапазона или к началу активности.
     */
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

export interface ITimelineColumnsFilter<TPosition = Date> extends IDynamicColumnsFilter<TPosition> {
    quantum: Quantum;
    scale: number;
}

/**
 * Параметры фабрики данных для "Таймлайн таблицы"
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments
 * @public
 * @example
 * <pre brush-'js'>
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
 */
export interface ITimelineGridDataFactoryArguments
    extends IDynamicGridDataFactoryArguments<Date, Date> {
    /**
     * Параметры горизонтальной навигации по колонкам.
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/ITimelineColumnsNavigation}
     * @example
     * В случае данного примера
     * 1. В фильтр будет добавлено поле dynamicColumnsData, содержащее данные курсора
     * 2. Ожидается, что возвращаемые записи будут содержать поле dynamicColumnsData с данными динамических колонок.
     * <pre brush-'js'>
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
     * Для того, чтобы выбранный временной период сохранялся на сервисе параметров, необходимо указать параметр rangeHistoryId.
     * @remark
     * Стоит обратить внимание, что значение диапазона зависит от ширины видимой области и минимальной ширины колонок. Если указанный диапазон не умещается в заданную ширину, то будет посчитан и применён такой диапазон, чтобы все колонки уместились.
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/IRange}
     * @example
     * <pre brush-'js'>
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
     * Ключ в истории для сохранения последнего выбранного периода.
     * @cfg {String}
     * @see range
     */
    rangeHistoryId?: string;
    /**
     * Видимость дополнительной колонки
     * @cfg {Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments/TAggregationVisibility.typedef}
     * @see Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps#aggregationRender
     * @see Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/useAggregationData
     */
    aggregationVisibility?: TAggregationVisibility;
    /**
     * Имя свойства строки данных, содержащего RecordSet с событиями.
     * Подробнее о настройке событий смотрите в {@link https://n.sbis.ru/article/f7bb1ba6-a1ec-4ba0-bf13-dab154fe5df3} базе знаний}
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
     * @demo Controls-Lists-demo/timelineGrid/WI/Scale/Index
     * @example
     * <pre class="brush: js">
     *    quantums: [
     *        {
     *            name: Quantum.Minute,
     *            scales: [30, 15],
     *            selectedScale: 30,
     *        },
     *        {
     *            name: Quantum.Hour
     *        },
     *        {
     *            name: Quantum.Day
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
    quantums: IQuantum[];
    range: IRange;
    quantumScaleMap: TQuantumScaleMap;
}
