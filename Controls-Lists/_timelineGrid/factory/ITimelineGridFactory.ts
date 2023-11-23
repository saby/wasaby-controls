import type { IDataFactory } from 'Controls/dataFactory';
import type { TVisibility } from 'Controls/interface';
import {
    IDynamicColumnsNavigationSourceConfig,
    IDynamicColumnsNavigation,
    IDynamicGridDataFactoryArguments,
    IDynamicColumnsFilter,
} from 'Controls-Lists/dynamicGrid';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';
import { IHolidaysConfig } from 'Controls-Lists/_timelineGrid/render/Holidays';

/**
 * Видимость колонки итогов по строкам
 * @typedef {String} Controls-Lists/_timelineGrid/factory/ITimelineGridFactory/TAggregationVisibility
 * @variant visible Колонка-агрегат видна
 * @variant hidden Колонка-агрегат скрыта
 */
export type TAggregationVisibility = Extract<TVisibility, 'visible' | 'hidden'>;

/**
 * Интерфейс объекта, содержащего диапазон дат отображаемого периода.
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridFactory/IRange
 * @public
 */
export interface IRange {
    start: Date;
    end: Date;
    needScroll?: boolean;
}

export interface ITimelineColumnsNavigationSourceConfig<TPosition = Date>
    extends IDynamicColumnsNavigationSourceConfig<TPosition> {}

export interface ITimelineColumnsNavigation<TPosition = Date>
    extends IDynamicColumnsNavigation<TPosition> {}

export interface ITimelineColumnsFilter<TPosition = Date> extends IDynamicColumnsFilter<TPosition> {
    quantum: Quantum;
}

/**
 * Аргументы фабрики данных для "Таймлайн таблицы"
 * @interface Controls-Lists/_timelineGrid/factory/ITimelineGridFactory
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
 *                },
 *                dynamicColumnsDataProperty: // Имя свойства записи, содержащего данные для рендера динамических колонок
 *            },
 *         },
 *     };
 * }
 */
export interface ITimelineGridDataFactoryArguments<
    TNavigationPosition = Date,
    TColumnsGridData = Date
> extends IDynamicGridDataFactoryArguments<TNavigationPosition, TColumnsGridData> {
    /**
     * Диапазон дат для отображения периода
     */
    range: IRange;
    /**
     * Ключ в истории для сохранения последнего выбранного периода.
     */
    rangeHistoryId?: string;
    /**
     * Видимость закреплённой колонки итогов по строкам (Агрегат по колонкам)
     * @see Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps#aggregationRender
     */
    aggregationVisibility?: TAggregationVisibility;
    /**
     * Имя свойства строки данных, содержащего RecordSet с событиями.
     * Подробнее о настройке событий смотрите в {@link https://n.sbis.ru/article/f7bb1ba6-a1ec-4ba0-bf13-dab154fe5df3 }базе знаний}
     * @see eventsProperty
     * @see eventStartProperty
     */
    eventsProperty?: string;
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату начала события
     * @see eventsProperty
     * @see eventEndProperty
     */
    eventStartProperty?: string;
    /**
     * Имя свойства записи в RecordSet с событиями, содержащее дату окончания события
     * @see eventsProperty
     * @see eventStartProperty
     */
    eventEndProperty?: string;
    /**
     * Конфигурация календаря праздничных дней
     */
    holidaysConfig?: IHolidaysConfig;
}

export type ITimelineGridDataFactory = IDataFactory<unknown, ITimelineGridDataFactoryArguments>;
