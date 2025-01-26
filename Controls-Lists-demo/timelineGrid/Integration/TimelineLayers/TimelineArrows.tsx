import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Logger } from 'UI/Utils';
import { date as formatDate } from 'Types/formatter';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IDataConfig } from 'Controls/dataFactory';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import { TGetTreeRowPropsCallback } from 'Controls/treeGrid';
import { View as Toolbar } from 'Controls/toolbars';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';

import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { useSlice } from 'Controls-DataEnv/context';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

import {
    ICustomEventRenderProps,
    IDynamicColumnConfig,
    THoverMode,
} from 'Controls-Lists/dynamicGrid';
import {
    DateType,
    IHolidaysConfig,
    IRange,
    isWeekendDate,
    ITimelineGridDataFactoryArguments,
    ITimelineGridSliceState,
    Quantum,
    MonthRange,
    RangeSelectorConnectedComponent,
    TimelineGridConnectedComponent,
    TimelineGridSlice,
    TSeparatorMode,
    TTimelineScrollViewMode,
    DayRange,
    ArrowsLayer,
} from 'Controls-Lists/timelineGrid';

import { default as ExtMemory } from './Data/ExtMemory';
import { IDynamic } from 'Controls-Lists-demo/timelineGrid/Sources/generateDynamicColumnsData';
import { IStaff, START_DATE } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import {
    default as getHolidaysCalendar,
    getHolidayConfig,
} from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import 'css!Controls-Lists-demo/timelineGrid/Sources/timelineDemo';

// Demo Renders
import EventRenderComponent from '../Sources/Components/EventRenderComponent';
import DynamicColumnComponent from '../Sources/Components/DynamicColumnComponent';
import StaticColumnComponent from '../Sources/Components/StaticColumnComponent';
import { URL } from 'Browser/Transport';

// Идентификатор слайса данных в контексте.
const STORE_ID = 'TimelineGridArrows';

// минимальные ширины колонок
const dynamicColumnMinWidths = {
    quarterHour: '48px',
    halfHour: '48px',
    hour: '48px',
    day: '20px',
    month: '53px',
};

// Константы времени
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

// Ширина зафиксированнызх колонок
const STATIC_COLUMN_WIDTH = 300;

// Для того, чтобы правильно устанавливался период при переходе в часы,
// Вьюпорт должен вмещать минимум 24 часа.
// TODO https://online.sbis.ru/opendoc.html?guid=384b682c-32c4-4eac-9ccf-19f1aeeea917&client=3
const DYNAMIC_VIEWPORT_WIDTH = parseInt(dynamicColumnMinWidths.hour, 10) * HOURS_IN_DAY; // = 1152

// Размер вьюпорта (1452)
const VIEWPORT_WIDTH = DYNAMIC_VIEWPORT_WIDTH + STATIC_COLUMN_WIDTH;

// Зафиксированная дата для отображения линии текущего дня
const FIXED_DATE = new Date(2023, 0, 9, 14);

// Название поле записи в RecordSet, которое содержит данные динамических колонок.
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

// Events RecordSet field
const EVENTS_DATA_FIELD = 'EventRS';

// прикладная функция, возвращающая начало и конец периода для подскролла к началу активности
function loadedRangeAdjustmentCallback(items: RecordSet, range: IRange): IRange {
    if (items) {
        const start = new Date(range.start);
        const end = new Date(range.start);
        let minEventMinutes: number | undefined;
        let maxEventMinutes: number | undefined;
        items.forEach((item) => {
            const events = item.get(EVENTS_DATA_FIELD);
            if (events?.getCount?.()) {
                events.forEach((event) => {
                    if (event.get('eventType') === 'shift') {
                        const dateStart = event.get('DTStart');
                        const dateEnd = event.get('DTEnd');
                        const dateStartMinutes =
                            dateStart.getHours() * MINUTES_IN_HOUR + dateStart.getMinutes();
                        const dateEndMinutes =
                            dateEnd.getHours() * MINUTES_IN_HOUR + dateEnd.getMinutes();
                        if (dateStart.getDate() === start.getDate()) {
                            minEventMinutes = minEventMinutes
                                ? Math.min(minEventMinutes, dateStartMinutes)
                                : dateStartMinutes;
                        }
                        if (dateEnd.getDate() === end.getDate()) {
                            maxEventMinutes = maxEventMinutes
                                ? Math.max(maxEventMinutes, dateEndMinutes)
                                : dateEndMinutes;
                        }
                    }
                });
            }
        });

        // Отсчитывать рабочее время нужно от начала суток.
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        start.setMinutes(minEventMinutes || 0);
        end.setMinutes(maxEventMinutes || 0);

        return {
            start,
            end,
        };
    } else {
        return range;
    }
}

// Доступные настройки переключения квантов
const quantumsSets = {
    // По умолчанию: месяцы -> дни(месяц) -> дни(неделя) -> часы -> 30мин -> 15мин
    default: [
        {
            name: Quantum.QuarterHour, // день, по 15 минут
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.HalfHour, // день, по 30 минут
            loadedRangeAdjustmentCallback,
            default: true,
        },
        {
            name: Quantum.Hour, // день, по 1 часу
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.Day, // Дни
            scales: [
                {
                    value: DayRange.Month, // режим месяц
                },
                {
                    value: DayRange.Week, // режим неделя
                },
            ],
        },
        {
            name: Quantum.Month, // год по месяцам
        },
    ],

    // Часы пропущены: месяцы -> дни(месяц) -> дни(неделя) -> 30мин -> 15мин
    skipHours: [
        {
            name: Quantum.HalfHour,
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.Day, // Дни = режим месяц, режим неделя
            scales: [
                {
                    value: DayRange.Month, // режим месяц
                },
                {
                    value: DayRange.Week, // режим неделя
                },
            ],
        },
        {
            name: Quantum.Month, // год по месяцам
        },
    ],

    // Доступны только дни
    daysOnly: [
        {
            name: Quantum.Day, // Дни = режим месяц, режим неделя
            scales: [
                {
                    value: DayRange.Month, // режим месяц
                },
            ],
        },
    ],

    // * all Все варианты: месяцы(год) -> месяцы(полугодия) -> месяцы(четверти) -> дни(месяц) -> дни(неделя) -> часы -> 30мин -> 15мин.
    all: [
        {
            name: Quantum.QuarterHour, // день, по 15 минут
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.HalfHour, // день, по 30 минут
            default: true,
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.Hour, // Часы = режим день
            loadedRangeAdjustmentCallback,
        },
        {
            name: Quantum.Day, // Дни = режим месяц, режим неделя
            scales: [
                {
                    value: DayRange.Month, // режим месяц
                },
                {
                    value: DayRange.Week, // режим неделя
                },
            ],
        },
        {
            name: Quantum.Month, // Месяцы = режим год, режим полугодие, режим четверть
            scales: [
                {
                    value: MonthRange.Year, // режим год
                    accessibility: 'zoom',
                },
                {
                    value: MonthRange.HalfYear, // режим полгода
                    accessibility: 'zoom',
                },
                {
                    value: MonthRange.Quarter, // режим четверть
                    accessibility: 'zoom',
                },
            ],
        },
    ],
};

// Выбираем тип разделителей в зависимости от кванта
function calcVerticalSeparators(quantum: Quantum): TSeparatorMode {
    return quantum === Quantum.Hour ||
        quantum === Quantum.HalfHour ||
        quantum === Quantum.QuarterHour
        ? 'line'
        : 'gap';
}

// По кнопкам зуммирования можно переходить между режимами
// В режиме Год есть опциональная возможность зума до 6 и 3 месяцев.
// В пограничных состояниях зума одна из кнопок зуммирования должна деактивироваться (переходить в режим ReadOnly)
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const [scrollViewMode, setScrollViewMode] =
        React.useState<TTimelineScrollViewMode>('unaccented');

    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);

    if (!slice) {
        Logger.error(
            'Не смогли загрузить слайс. Вероятно, произошла ошибка при сериализации данных.'
        );
    }

    const listActions = React.useMemo(() => slice.state.listActions, [slice.state.listActions]);
    const getRowProps = React.useCallback<TGetTreeRowPropsCallback>((item: Model) => {
        return {
            backgroundStyle: item.get('type') === null ? 'default' : 'unaccented',
            markerSize: item.get('type') === null ? 'image-l' : 'content-xs',
        };
    }, []);

    // Текущий режим разделителй
    const verticalSeparatorsMode = React.useMemo(() => {
        return calcVerticalSeparators(slice.quantum);
    }, [slice.quantum]);

    React.useEffect(() => {
        slice.setState({
            dynamicColumn: getDynamicColumn({
                holidaysData: getHolidaysCalendar(START_DATE),
                holidaysConfig: getHolidayConfig(),
                hoverMode: 'cell',
                quantum: slice.quantum,
            }),
        });
    }, [slice.quantum]);

    const getEventRenderProps = React.useCallback(
        (event: Model) => {
            if (
                event.get('startRow') === undefined ||
                (slice.quantum !== Quantum.Hour &&
                    slice.quantum !== Quantum.HalfHour &&
                    slice.quantum !== Quantum.QuarterHour)
            ) {
                return {} as ICustomEventRenderProps;
            }
            return {
                startRow: event.get('startRow'),
                endRow: event.get('endRow'),
            } as ICustomEventRenderProps;
        },
        [slice.quantum]
    );

    return (
        <div ref={ref}>
            <div className="tw-flex">
                <div
                    className="controlsListsDemo__timelineGrid_WI_Base"
                    style={{ maxWidth: `${VIEWPORT_WIDTH}px` }}
                >
                    <ScrollContainer
                        scrollOrientation={SCROLL_MODE.VERTICAL}
                        className={'controlsListsDemo__timelineGrid_WI_Base-scrollContainer'}
                    >
                        <TimelineGridConnectedComponent
                            columnScrollViewMode={scrollViewMode}
                            storeId={STORE_ID}
                            layers={[
                                <ArrowsLayer
                                    data={[
                                        {
                                            from: 'vacation-0',
                                            to: 'vacation-1',
                                            style: { color: '#cc0000' },
                                        },
                                        {
                                            from: 'vacation-1',
                                            to: 'vacation-3',
                                            style: { color: '#9b03ff' },
                                        },
                                    ]}
                                    key={'key1'}
                                />,
                                <ArrowsLayer
                                    data={[
                                        {
                                            from: 'vacation-0',
                                            to: 'vacation-3',
                                            style: { color: '#00006d' },
                                        },
                                    ]}
                                    key={'key2'}
                                />,
                            ]}
                            eventRender={<EventRenderComponent />}
                            viewportWidth={VIEWPORT_WIDTH}
                            getRowProps={getRowProps}
                            fixedTimelineDate={FIXED_DATE}
                            dynamicColumnMinWidths={dynamicColumnMinWidths}
                            verticalSeparatorsMode={verticalSeparatorsMode}
                            getEventRenderProps={getEventRenderProps}
                            hoverMode={'cell'}
                            columnsSpacing={'null'}
                        />
                    </ScrollContainer>
                </div>
                <ToolbarContainer storeId={STORE_ID} actions={listActions}>
                    <Toolbar direction="vertical" contrastBackground={true} />
                </ToolbarContainer>
            </div>
        </div>
    );
}

// функция для демки, позволяющая вернуть диапазон дат для отображения таймлайн таблицы при открытии
function getInitialRange(quantumsSetName: string): IRange {
    const currentDate = new Date(2023, 0, 1);

    // Период должен быть 1 год
    if (quantumsSetName === 'all') {
        return {
            start: currentDate,
            end: BaseDateUtils.getEndOfYear(currentDate),
        };
    }
    return {
        start: BaseDateUtils.getStartOfMonth(currentDate),
        end: BaseDateUtils.getEndOfMonth(currentDate),
    };
}

// Конфигурация статически отображаемых колонок.
// Аналог columns для обычного grid
function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '300px',
            render: <StaticColumnComponent />,
        },
    ];
}

interface IGetDynamicColumnParams {
    holidaysData: RecordSet;
    holidaysConfig: IHolidaysConfig;
    hoverMode?: THoverMode;
    quantum?: Quantum;
}

// Конфигурация динамических колонок
function getDynamicColumn(params: IGetDynamicColumnParams): IDynamicColumnConfig<Date> {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DynamicColumnComponent />,
        getCellProps: (item: Model<IStaff>, date: Date) => {
            const isDayMode =
                params.quantum === Quantum.Hour ||
                params.quantum === Quantum.HalfHour ||
                params.quantum === Quantum.QuarterHour;
            const isYearMode = params.quantum === Quantum.Month;

            // Определяем, входит ли дата в период трудоустройства.
            const isDateWithinWorkPeriod = item.get('startWorkDate').getTime() < date.getTime();
            const borderVisibility = !isDateWithinWorkPeriod ? 'hidden' : 'onhover';
            const borderRadius = isDayMode ? 'null' : 's';
            let isWeekendOrHoliday: boolean;
            if (!isYearMode) {
                // Получаем данные для сотрудника на сгененрированную дату
                const dateStr = formatDate(date, 'YYYY-MM-DD HH:mm:ssZ');
                const dayData = item
                    .get(DYNAMIC_COLUMN_DATA_FIELD)
                    .getRecordById(dateStr) as Model<IDynamic>;
                // Определяем выходные и рпаздничные дни
                isWeekendOrHoliday =
                    isWeekendDate(date, params.holidaysData, params.holidaysConfig) ||
                    dayData?.get('dayType') === DateType.Holiday;
            } else {
                isWeekendOrHoliday = false;
            }
            const backgroundStyle = isWeekendOrHoliday
                ? 'schedule_timelineDemo_dayoff'
                : 'schedule_timelineDemo_workday';

            // Нужно также рассчитать по событиям максимальную строку для динамической колонки.
            let maxRow = 2;
            if (item?.get(EVENTS_DATA_FIELD) !== undefined && isDayMode) {
                item.get(EVENTS_DATA_FIELD).forEach((event) => {
                    if (event.get('endRow') !== undefined && event.get('endRow') > maxRow) {
                        maxRow = event.get('endRow');
                    }
                });
            }

            return {
                fontSize: '3xs',
                valign: null,
                padding: {
                    left: '2xs',
                    right: '2xs',
                },
                backgroundStyle: !isDateWithinWorkPeriod || isDayMode ? null : backgroundStyle,
                borderVisibility,
                topLeftBorderRadius: borderRadius,
                topRightBorderRadius: borderRadius,
                bottomRightBorderRadius: borderRadius,
                bottomLeftBorderRadius: borderRadius,
                borderStyle: params.hoverMode === 'cell' ? 'cadetBlue' : 'default',
                maxRow,
            };
        },
    };
}

// Конигурация заголовков статически отображаемых колонок.
function getStaticHeaders(): IHeaderConfig[] {
    return [
        {
            key: 'staticHeader',
            render: (
                <RangeSelectorConnectedComponent
                    storeId={STORE_ID}
                    fontColorStyle={'primary'}
                    fixedDate={FIXED_DATE}
                />
            ),
        },
    ];
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
        // Для смены режима переключения квантов и масштабов, передайте в get параметр quantums одно из значений:
        // * default По умолчанию: месяцы -> дни -> дни(неделя) -> часы -> 30мин -> 15мин
        // * skipHours Часы пропущены: месяцы -> дни -> дни(неделя) -> 30мин -> 15мин
        // * daysOnly Доступны только дни -> дни(неделя)
        // * all Все варианты: месяцы(год) -> месяцы(полугодия) -> месяцы(четверти) -> дни(месяц) -> дни(неделя) -> часы -> 30мин -> 15мин.
        //   При этом значении начальным диапазоном будет 6 лет (отображение полугодий).
        const quantumsSetName = URL.getQueryParam('quantums') || 'all';
        return {
            [STORE_ID]: {
                dataFactoryName: 'Controls-Lists/timelineGrid:TimelineGridFactory',
                dataFactoryArguments: {
                    source: new ExtMemory({
                        keyProperty: 'key',
                        dynamicColumnDataField: DYNAMIC_COLUMN_DATA_FIELD,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    displayProperty: 'name',
                    root: null,
                    columnsNavigation: {
                        sourceConfig: {
                            field: DYNAMIC_COLUMN_DATA_FIELD,
                        },
                    },
                    range: getInitialRange(quantumsSetName),
                    staticColumns: getStaticColumns(),
                    staticHeaders: getStaticHeaders(),
                    dynamicColumn: getDynamicColumn({
                        holidaysData: getHolidaysCalendar(START_DATE),
                        holidaysConfig: getHolidayConfig(),
                        hoverMode: 'cell',
                    }),
                    dynamicHeader: {},
                    holidaysConfig: getHolidayConfig(),
                    eventsProperty: EVENTS_DATA_FIELD,
                    eventStartProperty: 'DTStart',
                    eventEndProperty: 'DTEnd',
                    quantums: quantumsSets[quantumsSetName],
                    listActions: 'Controls-Lists-demo/timelineGrid/Integration/Sources/listActions',
                },
            },
        };
    },
});
