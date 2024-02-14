import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { date as formatDate } from 'Types/formatter';
import { adapter, Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
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
        },
    ];
}

function getInitialRange(): IRange {
    return {
        start: new Date(2023, 0, 1),
        end: new Date(2023, 0, 16),
    };
}

function TimelineGridDemo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div className="controlsListsDemo__dynamicGridBase" ref={ref}>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <TimelineGridConnectedComponent
                    storeId={STORE_ID}
                    viewportWidth={757}
                    className="controlsListsDemo__dynamicGridBase"
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
                    range: getInitialRange(),
                    columnsNavigation: {
                        sourceConfig: {
                            field: DYNAMIC_COLUMN_DATA_FIELD,
                        },
                    },
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn({
                        holidaysData: holidaysCalendar,
                        holidaysConfig,
                    }),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: {},
                    holidaysConfig,
                },
            },
        };
    },
});
