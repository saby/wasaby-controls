import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
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
    RangeSelectorConnectedComponent,
    TimelineGridConnectedComponent,
    TimelineGridSlice,
    TSeparatorMode,
    TTimelineScrollViewMode,
} from 'Controls-Lists/timelineGrid';

import { default as ExtMemory } from './Sources/Data/ExtMemory';
import { IDynamic } from 'Controls-Lists-demo/timelineGrid/Sources/generateDynamicColumnsData';
import { IStaff, START_DATE } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import {
    default as getHolidaysCalendar,
    getHolidayConfig,
} from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import 'css!Controls-Lists-demo/timelineGrid/Sources/timelineDemo';

// Demo Renders
import EventRenderComponent from './Sources/Components/EventRenderComponent';
import DynamicColumnComponent from './Sources/Components/DynamicColumnComponent';
import StaticColumnComponent from './Sources/Components/StaticColumnComponent';
import { URL } from 'Browser/Transport';

// Идентификатор слайса данных в контексте.
const STORE_ID = 'TimelineGridBase';

// Ширина колонки часов
const HOURS_COLUMN_MIN_WIDTH = 48;

// Константы времени
const HOURS_IN_DAY = 24;
// минимальные ширины колонок
const dynamicColumnMinWidths = {
    day: '36px',
    month: '53px',
    week: '100px',
    quarter: '100px',
    year: HOURS_COLUMN_MIN_WIDTH * HOURS_IN_DAY + 'px',
};

// Ширина зафиксированнызх колонок
const STATIC_COLUMN_WIDTH = 300;

const DYNAMIC_VIEWPORT_WIDTH = HOURS_COLUMN_MIN_WIDTH * HOURS_IN_DAY; // = 1152

// Размер вьюпорта (1452)
const VIEWPORT_WIDTH = DYNAMIC_VIEWPORT_WIDTH + STATIC_COLUMN_WIDTH;

// Зафиксированная дата для отображения линии текущего дня
const FIXED_DATE = new Date(2023, 0, 9, 14);

// Название поле записи в RecordSet, которое содержит данные динамических колонок.
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

// Events RecordSet field
const EVENTS_DATA_FIELD = 'EventRS';

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
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);
    const [quantumConfig, setQuantumConfig] = React.useState<{ quantum?: Quantum; range?: string }>(
        {
            quantum: 'year',
            range: 'year',
        }
    );

    if (!slice) {
        Logger.error(
            'Не смогли загрузить слайс. Вероятно, произошла ошибка при сериализации данных.'
        );
    }

    const onApplyButton = React.useCallback(() => {
        if (!slice || !quantumConfig) {
            return;
        }
        let range: IRange;
        switch (quantumConfig.range) {
            case 'year':
                range = {
                    start: BaseDateUtils.getStartOfYear(slice.visibleRange.start),
                    end: BaseDateUtils.getEndOfYear(slice.visibleRange.start),
                };
                break;
            case 'quarter':
                range = {
                    start: BaseDateUtils.getStartOfQuarter(slice.visibleRange.start),
                    end: BaseDateUtils.getEndOfQuarter(slice.visibleRange.start),
                };
                break;
            case 'month':
                range = {
                    start: BaseDateUtils.getStartOfMonth(slice.visibleRange.start),
                    end: BaseDateUtils.getEndOfMonth(slice.visibleRange.start),
                };
                break;
            case 'week':
                range = {
                    start: BaseDateUtils.getStartOfWeek(slice.visibleRange.start),
                    end: BaseDateUtils.getEndOfWeek(slice.visibleRange.start),
                };
                break;
        }
        slice.setRange(range, false, false, quantumConfig.quantum);
    }, [slice, quantumConfig]);

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
            <div style={{ height: '50px' }}>
                <label style={{ marginRight: '10px' }}>
                    Квант:&nbsp;
                    <select
                        value={quantumConfig.quantum}
                        onChange={(event) =>
                            setQuantumConfig({ ...quantumConfig, quantum: event.target.value })
                        }
                    >
                        <option value="year">Год</option>
                        <option value="quarter">Квартал</option>
                        <option value="month">Месяц</option>
                        <option value="week">Неделя</option>
                    </select>
                </label>
                <label>
                    &nbsp;Период:&nbsp;
                    <select
                        value={quantumConfig.range}
                        onChange={(event) =>
                            setQuantumConfig({ ...quantumConfig, range: event.target.value })
                        }
                    >
                        <option value="year">Год</option>
                        <option value="quarter">Квартал</option>
                        <option value="month">Месяц</option>
                        <option value="week">Неделя</option>
                    </select>
                </label>
                <button
                    data-qa="Controls-demon__apply"
                    onClick={onApplyButton}
                    style={{ padding: '3px' }}
                >
                    Применить
                </button>
            </div>
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
                            columnScrollViewMode="unaccented"
                            storeId={STORE_ID}
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
function getInitialRange(): IRange {
    const currentDate = new Date(2023, 0, 1);
    return {
        start: currentDate,
        end: BaseDateUtils.getEndOfYear(currentDate),
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

            const getTagColor = (date: Date) => {
                const day = +formatDate(date, 'DD');
                const isNeededName = item.get('name') === 'Сидорова Алиса';

                if (!isNeededName) {
                    return null;
                }

                switch (day) {
                    case 5:
                        return 'danger';
                    case 6:
                        return 'success';
                    case 7:
                        return 'warning';
                    case 8:
                        return 'primary';
                    case 9:
                        return 'info';
                    case 10:
                        return 'secondary';
                    default:
                        return null;
                }
            };
            return {
                tagStyle: getTagColor(date),
                tagPosition: getTagColor(date) && 'border',
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
    const quantumsSetName = URL.getQueryParam('quantums') || 'default';
    // Повторяем кейс, когда нельзя выбирать вообще ничего, кроме месяца и года
    const ranges =
        quantumsSetName === 'daysAndMonths'
            ? {
                  months: [1, 12],
                  years: [1],
              }
            : undefined;
    return [
        {
            key: 'staticHeader',
            render: (
                <RangeSelectorConnectedComponent
                    storeId={STORE_ID}
                    fontColorStyle={'primary'}
                    fixedDate={FIXED_DATE}
                    ranges={ranges}
                />
            ),
        },
    ];
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
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
                    range: getInitialRange(),
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
                    quantums: [
                        {
                            name: Quantum.Day, // Дни = Период месяц, неделя
                        },
                        {
                            name: Quantum.Week, // недели = Период месяц, квартал, неделя
                            default: true,
                        },
                        {
                            name: Quantum.Month, // Месяцы = Период год
                        },
                        {
                            name: Quantum.Quarter, // Квартал = Период год, квартал
                        },
                        {
                            name: Quantum.Year, // Год = Период год
                            default: true,
                        },
                    ],
                    listActions: 'Controls-Lists-demo/timelineGrid/Integration/Sources/listActions',
                },
            },
        };
    },
});
