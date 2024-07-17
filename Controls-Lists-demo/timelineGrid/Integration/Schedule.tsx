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
import { IListAction } from 'Controls/actions';
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

// Идентификатор слайса данных в контексте.
const STORE_ID = 'TimelineGridBase';

// Размер вьюпорта
const VIEWPORT_WIDTH = 1080;

// Зафиксированная дата для отображения линии текущего дня
const FIXED_DATE = new Date(2023, 0, 9, 14);

// Название поле записи в RecordSet, которое содержит данные динамических колонок.
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

// Разруливаем видимость экшнов в тулбаре
function getListActions(slice?: TimelineGridSlice): IListAction[] {
    return (slice?.state.quantum === Quantum.Hour || slice?.state.quantum === Quantum.Minute
        ? slice.state.listActions
        : []) as unknown as IListAction[];
}

// Выбираем тип разделителей в зависимости от кванта
function calcVerticalSeparators(quantum: Quantum): TSeparatorMode {
    return quantum === Quantum.Hour || quantum === Quantum.Minute ? 'line' : 'gap';
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);

    if (!slice) {
        Logger.error(
            'Не смогли загрузить слайс. Вероятно, произошла ошибка при сериализации данных.'
        );
    }

    const [listActions, setListActions] = React.useState(getListActions(slice));
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

    // минимальные ширины колонок
    const dynamicColumnMinWidths = React.useMemo(() => {
        return {
            minute: '48px',
            hour: '48px',
            day: '20px',
            month: '53px',
        };
    }, []);

    React.useEffect(() => {
        setListActions(getListActions(slice));

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
                (slice.quantum !== Quantum.Hour && slice.quantum !== Quantum.Minute)
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
        <div ref={ref} className="tw-flex">
            <div
                className="controlsListsDemo__timelineGrid_WI_Base"
                style={{ maxWidth: `${VIEWPORT_WIDTH}px` }}
            >
                <ScrollContainer
                    scrollOrientation={SCROLL_MODE.VERTICAL}
                    className={'controlsListsDemo__timelineGrid_WI_Base-scrollContainer'}
                >
                    <TimelineGridConnectedComponent
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
    );
}

// функция для демки, позволяющая вернуть диапазон дат для отображения таймлайн таблицы при открытии
function getInitialRange(): IRange {
    const currentDate = new Date(2023, 0, 1);

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
            const isDayMode = params.quantum === Quantum.Hour || params.quantum === Quantum.Minute;
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
            let endRow = 2;
            if (item?.get('EventRS') !== undefined && isDayMode) {
                item.get('EventRS').forEach((event) => {
                    if (event.get('endRow') !== undefined && event.get('endRow') > endRow) {
                        endRow = event.get('endRow');
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
                endRow,
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
                    eventsProperty: 'EventRS',
                    eventStartProperty: 'DTStart',
                    eventEndProperty: 'DTEnd',
                    quantums: [
                        {
                            name: Quantum.Minute,
                            scales: [30, 15],
                            selectedScale: 30,
                        },
                        {
                            name: Quantum.Hour,
                        },
                        {
                            name: Quantum.Day,
                        },
                        {
                            name: Quantum.Month,
                        },
                    ],
                    listActions: 'Controls-Lists-demo/timelineGrid/Integration/Sources/listActions',
                },
            },
        };
    },
});
