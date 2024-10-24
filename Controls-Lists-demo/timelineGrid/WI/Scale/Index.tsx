import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
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

import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
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
} from 'Controls-Lists/timelineGrid';

import { default as ExtMemory } from './Data/ExtMemory';
import { IDynamic } from 'Controls-Lists-demo/timelineGrid/Sources/generateDynamicColumnsData';
import { IStaff } from 'Controls-Lists-demo/timelineGrid/Sources/Data';
import {
    getHolidayConfig,
    default as getHolidaysCalendar,
} from 'Controls-Lists-demo/timelineGrid/Sources/getHolidaysCalendar';
import 'css!Controls-Lists-demo/timelineGrid/WI/Scale/Scale';

// Demo Renders
import EventRenderComponent from './Components/EventRenderComponent';
import DynamicColumnComponent from './Components/DynamicColumnComponent';
import StaticColumnComponent from './Components/StaticColumnComponent';

// Идентификатор слайса данных в контексте.
const STORE_ID = 'TimelineGridBase';

// Размер вьюпорта
const VIEWPORT_WIDTH = 724;

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

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);
    const [listActions, setListActions] = React.useState(getListActions(slice));
    const getRowProps = React.useCallback<TGetTreeRowPropsCallback>((item: Model) => {
        return {
            backgroundStyle: item.get('type') === null ? 'default' : 'unaccented',
            markerSize: item.get('type') === null ? 'image-l' : 'content-xs',
        };
    }, []);

    const dynamicColumnMinWidths = React.useMemo(() => {
        return {
            minute: '61px',
            hour: '61px',
            day: '61px',
            month: '35px',
        };
    }, []);

    React.useEffect(() => {
        setListActions(getListActions(slice));
    }, [slice?.state.quantum]);

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
    return {
        start: new Date(2023, 0, 1, 6, 0),
        end: new Date(2023, 0, 1, 18, 0),
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
}

// Конфигурация динамических колонок
function getDynamicColumn(params: IGetDynamicColumnParams): IDynamicColumnConfig<Date> {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DynamicColumnComponent />,
        getCellProps: (item: Model<IStaff>, date: Date) => {
            // Получаем данные для сотрудника на сгененрированную дату
            const dateStr = formatDate(date, 'YYYY-MM-DD HH:mm:ssZ');
            const dayData = item
                .get(DYNAMIC_COLUMN_DATA_FIELD)
                .getRecordById(dateStr) as Model<IDynamic>;
            // Определяем, входит ли дата в период трудоустройства.
            const isDateWithinWorkPeriod = item.get('startWorkDate').getTime() < date.getTime();
            // Определяем выходные и рпаздничные дни
            const isWeekendOrHoliday =
                isWeekendDate(date, params.holidaysData, params.holidaysConfig) ||
                dayData?.get('dayType') === DateType.Holiday;

            return {
                fontSize: '3xs',
                valign: null,
                padding: {
                    left: '2xs',
                    right: '2xs',
                },
                backgroundStyle: !isDateWithinWorkPeriod
                    ? null
                    : isWeekendOrHoliday
                    ? 'timelineDemo_weekend'
                    : 'timelineDemo_workday',
                borderVisibility: !isDateWithinWorkPeriod ? 'visible' : 'hidden',
                borderStyle: 'default',
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
                        holidaysData: getHolidaysCalendar(new Date('2023-01-01 00:00:00+03')),
                        holidaysConfig: getHolidayConfig(),
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
                    listActions: 'Controls-Lists-demo/timelineGrid/WI/Scale/listActions',
                },
            },
        };
    },
});
