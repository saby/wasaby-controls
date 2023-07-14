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
} from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import ExtMemory, { generateHolidaysCalendar } from './ExtMemory';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';
import { adapter, Model } from 'Types/entity';
import DemoEventRenderComponent from './DemoEventRenderComponent';
import { DataContext } from 'Controls-DataEnv/context';
import { View as Spoiler } from 'Controls/spoiler';
import { getHolidayConfig } from './Holiday';
import { date as formatDate } from 'Types/formatter';
import { RecordSet } from 'Types/collection';
import { MultiSelectAccessibility } from 'Controls/display';
import { TColspanCallbackResult } from 'Controls/grid';

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
                    left: null,
                    right: null,
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

function isHolidayCallback(date: Date): Object {
    if (date.getMonth() === 4 && date.getDate() === 9) {
        return {
            caption: 'День победы',
            description: 'Основной календарь',
        };
    }
    if (date.getMonth() === 0 && date.getDate() === 7) {
        return {
            caption: 'Рождество Христово',
            description: 'Основной календарь',
        };
    }
}

function unselectHolidays(oldSelection, newSelection, items: RecordSet) {
    Object.keys(newSelection).forEach((itemKey) => {
        const item = items.getRecordById(itemKey);

        newSelection[itemKey].forEach((columnKey, index) => {
            const date = new Date(columnKey);
            if (
                isWeekendDate(date, items.getMetaData().holidaysData, getHolidayConfig()) ||
                item
                    .get(DYNAMIC_COLUMN_DATA_FIELD)
                    .getRecordById(formatDate(date, DATE_FORMAT))
                    ?.get('dayType') === 2
            ) {
                newSelection[itemKey][index] = null;
            }
        });
        newSelection[itemKey] = newSelection[itemKey].filter((i) => i !== null);

        if (newSelection[itemKey].length === 0) {
            delete newSelection[itemKey];
        }
    });

    return newSelection;
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

const Index = React.forwardRef(function Index(props, forwardedRef) {
    const containerRef = React.useRef<HTMLDivElement>();
    const [clickLog, setClickLog] = React.useState<string>('');

    const slice = React.useContext(DataContext)[STORE_ID];

    const onDynamicColumnClick = React.useCallback((_contents, _originalEvent, dynamicColumn) => {
        setClickLog(`Кликнули по ячейке ${dynamicColumn}`);
    }, []);

    const onEventClick = React.useCallback((_contents, _originalEvent, event) => {
        setClickLog(`Кликнули по событию ${event.get('eventId')}`);
    }, []);

    const editArrowClicked = React.useCallback(
        (item: Model) => {
            setClickLog('Кликнули по стрелке редактирования');
        },
        [slice]
    );

    const colspanCallback = React.useCallback(function (item): TColspanCallbackResult {
        return item.get('type') === true ? 2 : 0;
    }, []);

    return (
        <div
            className="controlsListsDemo__dynamicGridBase"
            ref={(el) => {
                forwardedRef?.(el);
                containerRef.current = el;
            }}
        >
            <div>{'лог:' + clickLog}</div>

            <div
                style={{
                    paddingLeft: 15,
                }}
            >
                <button
                    onClick={() => {
                        slice.setState({
                            selectedCells: {},
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
            </div>

            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <TimelineGridConnectedComponentMemo
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    colspanCallback={colspanCallback}
                    onDynamicColumnClick={onDynamicColumnClick}
                    onEventClick={onEventClick}
                    onEditArrowClick={editArrowClicked}
                    showEditArrow={true}
                    viewportWidth={containerRef.current?.offsetWidth || 1300}
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
                        position: new Date(2023, 0, 1),
                        direction: 'bothways',
                        limit: 90,
                    },
                },
                eventsProperty: 'EventRS',
                eventStartProperty: 'DTStart',
                eventEndProperty: 'DTEnd',
                eventRender: <DemoEventRenderComponent />,
                staticColumns: getStaticColumns(),
                dynamicColumn: getDynamicColumn(
                    generateHolidaysCalendar(new Date(2023, 0, 1)),
                    holidaysConfig
                ),
                staticHeaders: getStaticHeaders(),
                dynamicHeader: getDynamicHeader(),
                holidaysConfig,
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
