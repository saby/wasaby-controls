/**
 * Базовое демо компонента "Таблица с загружаемыми колонками"
 */
import * as React from 'react';
import { IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';
import {
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    isWeekendDate,
    IHolidaysConfig,
    IRange,
    useAggregationData,
} from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import ExtMemory, { generateHolidaysCalendar } from './ExtMemory';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import { adapter, Model } from 'Types/entity';
import DemoEventRenderComponent from './DemoEventRenderComponent';
import { DataContext } from 'Controls-DataEnv/context';
import { View as Spoiler } from 'Controls/spoiler';
import { getHolidayConfig } from './Holiday';
import { date as formatDate } from 'Types/formatter';
import { MultiSelectAccessibility } from 'Controls/display';
import { DebugLogger } from 'Controls/columnScrollReact';
import { TItemActionShowType } from 'Controls/itemActions';
import { Base as BaseDateUtils } from 'Controls/dateUtils';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';

const TimelineGridConnectedComponentMemo = React.memo(TimelineGridConnectedComponent);

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZ';

const DEMO_SELECTION = {
    2: [
        'Sat, 07 Jan 2023 21:00:00 GMT',
        'Sun, 08 Jan 2023 21:00:00 GMT',
        'Mon, 09 Jan 2023 21:00:00 GMT',
        'Thu, 12 Jan 2023 21:00:00 GMT',
    ],
    3: ['Sat, 07 Jan 2023 21:00:00 GMT', 'Sun, 08 Jan 2023 21:00:00 GMT'],
    4: [
        'Sat, 07 Jan 2023 21:00:00 GMT',
        'Sun, 08 Jan 2023 21:00:00 GMT',
        'Wed, 11 Jan 2023 21:00:00 GMT',
        'Thu, 12 Jan 2023 21:00:00 GMT',
    ],
};

function StaticHeaderRender(): React.ReactElement {
    return (
        <RangeSelectorConnectedComponent
            storeId="DemoDynamicGridStore"
            fontColorStyle={'primary'}
        />
    );
}

function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '300px',
            render: <DemoStaticColumnComponent />,
        },
    ];
}

function AggregationRender() {
    const { item, dateRange, aggregationQuantum } = useAggregationData();

    if (item.getKey() === 1) {
        return null;
    }
    const format = aggregationQuantum === 'day' ? 'DD-MM' : 'HH:mm';
    return (
        <div className="controls-fontsize-s controls-text-label">
            {formatDate(dateRange.start, format)}-{formatDate(dateRange.end, format)}
        </div>
    );
}

function getDynamicColumn(
    holidaysData: Record<string, unknown>[],
    holidaysConfig: IHolidaysConfig
): IColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '10px',
        render: <DemoDynamicColumnComponent />,
        getCellProps: (item: Model, date: Date) => {
            const dynamicColumnsData = item.get(DYNAMIC_COLUMN_DATA_FIELD);
            const dateStr = formatDate(date, DATE_FORMAT);
            const dayData = dynamicColumnsData.getRecordById(dateStr);
            const startWorkDate = new Date(item.get('startWorkDate'));
            const isWorked = startWorkDate.getTime() < date.getTime();
            const isWeekend =
                isWeekendDate(date, holidaysData, holidaysConfig) || dayData?.get('dayType') === 2;
            const backgroundStyle = !isWorked
                ? null
                : isWeekend
                ? 'timelineDemo_weekend'
                : 'timelineDemo_workday';
            const borderVisibility = !isWorked ? 'visible' : 'hidden';
            return {
                fontSize: '3xs',
                valign: null,
                padding: {
                    left: '2xs',
                    right: '2xs',
                },
                backgroundStyle,
                borderVisibility,
            };
        },
    };
}

function getStaticHeaders(): IHeaderConfig[] {
    return [
        {
            key: 'staticHeader',
            render: <StaticHeaderRender />,
        },
    ];
}

function getDynamicHeader(): IHeaderConfig {
    return {
        caption: 'ПН',
    };
}

function getInitialRange(): IRange {
    const currentDate = new Date(2023, 0, 1);

    return {
        start: BaseDateUtils.getStartOfMonth(currentDate),
        end: BaseDateUtils.getEndOfMonth(currentDate),
    };
}

function SpoilerLog(props: { log: string; caption: string }) {
    return (
        <Spoiler
            captions={props.caption}
            captionPosition={'left'}
            content={<pre>{props.log}</pre>}
        />
    );
}

const STORE_ID = 'DemoDynamicGridStore';

const ACTIONS: IItemAction[] = [
    {
        id: 10,
        icon: 'icon-Erase icon-error',
        title: 'delete pls',
        showType: TItemActionShowType.MENU,
        handler: () => {
            // eslint-disable-next-line
            console.log('click to error-icon');
        },
    },
    {
        id: 12,
        icon: 'icon-View',
        title: 'view',
        showType: TItemActionShowType.MENU,
        handler: () => {
            // eslint-disable-next-line
            console.log('click to View-icon');
        },
    },
    {
        id: 13,
        icon: 'icon-Motion',
        title: 'motion',
        showType: TItemActionShowType.MENU,
        handler: () => {
            // eslint-disable-next-line
            console.log('click to Motion-icon');
        },
    },
];

const Index = React.forwardRef(function Index(props, forwardedRef) {
    const [clickLog, setClickLog] = React.useState<string>('');
    const [viewportWidth, setViewportWidth] = React.useState<number>(1300);

    const slice = React.useContext(DataContext)[STORE_ID];

    DebugLogger.setDebug(true);

    const onDynamicColumnClick = React.useCallback((_contents, _originalEvent, dynamicColumn) => {
        setClickLog(`Кликнули по ячейке ${dynamicColumn}`);
    }, []);

    const onEventClick = React.useCallback((_contents, _originalEvent, event) => {
        setClickLog(`Кликнули по событию ${event.get('eventId')}`);
    }, []);

    const onItemClick = React.useCallback((_contents, _originalEvent, columnIndex) => {
        setClickLog(`Кликнули по записи ${_contents.get('title')}, колонка ${columnIndex}`);
    }, []);

    const toggleAggregation = React.useCallback(() => {
        slice.setState({
            aggregationVisibility:
                slice.state.aggregationVisibility === 'visible' ? 'hidden' : 'visible',
        });
    }, [slice]);

    const editArrowClicked = React.useCallback(
        (item: Model) => {
            setClickLog('Кликнули по стрелке редактирования');
        },
        [slice]
    );

    return (
        <div
            className="controlsListsDemo__dynamicGridBase"
            ref={forwardedRef}
            style={{ width: `${viewportWidth}px` }}
        >
            <div>{'лог:' + clickLog}</div>

            <div
                style={{
                    paddingLeft: 15,
                }}
            >
                <button
                    onClick={() => {
                        toggleAggregation();
                    }}
                >
                    Toggle aggregation
                </button>
            </div>

            <div
                style={{
                    paddingLeft: 15,
                }}
            >
                <button
                    onClick={() => {
                        slice.setState({
                            selectedCells: {},
                            multiSelectVisibility: 'hidden',
                        });
                    }}
                >
                    Сбросить выделение
                </button>

                <button
                    onClick={() => {
                        slice.setState({
                            selectedCells: DEMO_SELECTION,
                        });
                    }}
                >
                    Установить выделение в начале января
                </button>

                <SpoilerLog
                    caption="Выделенные ячейки"
                    log={JSON.stringify(slice.state.selectedCells, null, 2)}
                />

                <div>
                    Viewport width:
                    <input
                        type={'range'}
                        max={1900}
                        min={500}
                        value={viewportWidth}
                        onChange={(e) => setViewportWidth(Number(e.target.value))}
                    />
                </div>
            </div>

            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <TimelineGridConnectedComponentMemo
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    onDynamicColumnClick={onDynamicColumnClick}
                    onEventClick={onEventClick}
                    onItemClick={onItemClick}
                    hoverMode={'cross'}
                    itemActions={ACTIONS}
                    onEditArrowClick={editArrowClicked}
                    showEditArrow={true}
                    eventRender={<DemoEventRenderComponent />}
                    aggregationRender={<AggregationRender />}
                    viewportWidth={viewportWidth}
                />
            </ScrollContainer>
        </div>
    );
});

Index.getLoadConfig = (): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> => {
    const holidaysConfig = getHolidayConfig();
    return {
        DemoDynamicGridStore: {
            dataFactoryName: 'Controls-Lists/timelineGrid:TimelineGridFactory',
            dataFactoryArguments: {
                source: new ExtMemory({
                    keyProperty: 'key',
                    adapter: new adapter.Sbis(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                root: null,
                navigation: {
                    source: 'position',
                    sourceConfig: {
                        field: 'key',
                        position: 1,
                        direction: 'bothways',
                        limit: 20,
                    },
                },
                columnsNavigation: {
                    source: 'position',
                    sourceConfig: {
                        field: DYNAMIC_COLUMN_DATA_FIELD,
                    },
                },
                range: getInitialRange(),
                staticColumns: getStaticColumns(),
                dynamicColumn: getDynamicColumn(
                    generateHolidaysCalendar(new Date(2023, 0, 1)),
                    holidaysConfig
                ),
                staticHeaders: getStaticHeaders(),
                dynamicHeader: getDynamicHeader(),
                holidaysConfig,
                aggregationVisibility: 'hidden',
                eventsProperty: 'EventRS',
                eventStartProperty: 'DTStart',
                eventEndProperty: 'DTEnd',
                cellsMultiSelectAccessibilityCallback: (itemKey, columnKey) => {
                    if (
                        (itemKey === 6 || itemKey === '6') &&
                        new Date(columnKey) < new Date('Mon, 23 Jan 2023 21:00:00 GMT')
                    ) {
                        return MultiSelectAccessibility.hidden;
                    } else {
                        return MultiSelectAccessibility.enabled;
                    }
                },
            },
        },
    };
};

export default Index;
