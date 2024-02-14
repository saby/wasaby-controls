import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { date as formatDate } from 'Types/formatter';
import { adapter, Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { TGetTreeRowPropsCallback } from 'Controls/treeGrid';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    ITimelineGridDataFactoryArguments,
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    isWeekendDate,
    IHolidaysConfig,
    IRange,
    DateType,
} from 'Controls-Lists/timelineGrid';

import ExtMemory from './ExtMemory';
import DemoStaticColumnComponent from './renders/DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './renders/DemoDynamicColumnComponent';
import DemoEventRenderComponent from './renders/DemoEventRenderComponent';
import AggregationRenderComponent from './renders/AggregationRenderComponent';
import {
    default as generateHolidaysCalendar,
    getHolidayConfig,
} from '../Utils/getHolidaysCalendar';

interface IGetDynamicColumnParams {
    holidaysData: RecordSet;
    holidaysConfig: IHolidaysConfig;
}

import 'css!Controls-Lists-demo/timelineGrid/WI/Data/styles';

const STORE_ID = 'DemoDynamicGridStore';
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const holidaysConfig = getHolidayConfig();
const holidaysCalendar = generateHolidaysCalendar(new Date(2023, 0, 1));

function StaticHeaderRender(): React.ReactElement {
    return <RangeSelectorConnectedComponent storeId={STORE_ID} fontColorStyle={'primary'} />;
}

function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '300px',
            render: React.createElement(DemoStaticColumnComponent),
        },
    ];
}

function getDynamicColumn(params: IGetDynamicColumnParams): IDynamicColumnConfig<Date> {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DemoDynamicColumnComponent />,
        getCellProps: (item: Model, date: Date) => {
            const dynamicColumnsData = item.get(DYNAMIC_COLUMN_DATA_FIELD);
            const dateStr = formatDate(date, DATE_FORMAT);
            const dayData = dynamicColumnsData.getRecordById(dateStr);
            const startWorkDate = new Date(item.get('startWorkDate'));
            // Определяет, входит ли дата в период трудоустройства.
            const isWorked = startWorkDate.getTime() < date.getTime();
            const isWeekend =
                isWeekendDate(date, params.holidaysData, params.holidaysConfig) ||
                dayData?.get('dayType') === DateType.Holiday;
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
            getCellProps(model: Model) {
                return {
                    backgroundStyle: 'unaccented',
                };
            },
        },
    ];
}

function getDynamicHeader(): IHeaderConfig {
    return {};
}

function getInitialRange(): IRange {
    return {
        start: new Date(2023, 0, 1),
        end: new Date(2023, 0, 16),
    };
}

function TimelineGridDemo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const getRowProps = React.useCallback<TGetTreeRowPropsCallback>((item: Model) => {
        return {
            markerSize: item.get('type') === null ? 'image-l' : 'content-xs',
        };
    }, []);

    return (
        <div className="controlsListsDemo__dynamicGridBase" ref={ref}>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <TimelineGridConnectedComponent
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    showEditArrow={true}
                    eventRender={<DemoEventRenderComponent />}
                    aggregationRender={<AggregationRenderComponent />}
                    viewportWidth={757}
                    getRowProps={getRowProps}
                />
            </ScrollContainer>
        </div>
    );
}

export default Object.assign(React.forwardRef(TimelineGridDemo), {
    getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
        return {
            [STORE_ID]: {
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
                    columnsNavigation: {
                        sourceConfig: {
                            field: DYNAMIC_COLUMN_DATA_FIELD,
                        },
                    },
                    range: getInitialRange(),
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn({
                        holidaysData: holidaysCalendar,
                        holidaysConfig,
                    }),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: getDynamicHeader(),
                    holidaysConfig,
                    aggregationVisibility: 'visible',
                    eventsProperty: 'EventRS',
                    eventStartProperty: 'DTStart',
                    eventEndProperty: 'DTEnd',
                },
            },
        };
    },
});
