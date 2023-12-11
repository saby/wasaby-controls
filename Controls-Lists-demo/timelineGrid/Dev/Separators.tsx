import * as React from 'react';
import { Model, adapter } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { TInternalProps } from 'UICore/Executor';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { DataContext } from 'Controls-DataEnv/context';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { TQuantumType } from 'Controls-Lists/dynamicGrid';
import {
    TimelineGridConnectedComponent,
    ITimelineGridDataFactoryArguments,
    IRange,
    RangeSelectorConnectedComponent,
    IHolidaysConfig,
    isWeekendDate,
    ITimelineGridSliceState,
    TSeparatorMode,
} from 'Controls-Lists/timelineGrid';
import { TGetTreeRowPropsCallback } from 'Controls/treeGrid';

import DemoEventRenderComponent from 'Controls-Lists-demo/dynamicGrid/base/DemoEventRenderComponent';
import ExtMemory, {
    generateHolidaysCalendar,
} from 'Controls-Lists-demo/dynamicGrid/base/ExtMemory';
import DemoStaticColumnComponent from 'Controls-Lists-demo/dynamicGrid/base/DemoStaticColumnComponent';
import DemoDynamicColumnComponent from 'Controls-Lists-demo/dynamicGrid/base/DemoDynamicColumnComponent';
import { getHolidayConfig } from 'Controls-Lists-demo/dynamicGrid/base/Holiday';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';

const STORE_ID = 'TimelineGridData';
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZ';
const CURRENT_DATE = new Date(2023, 0, 13);

function getInitialRange(): IRange {
    return {
        start: CURRENT_DATE,
        end: CURRENT_DATE,
    };
}

function StaticHeaderRender(): React.ReactElement {
    return <RangeSelectorConnectedComponent storeId={STORE_ID} fontColorStyle={'primary'} />;
}

function getStaticColumns(): IColumnConfig[] {
    return [
        {
            key: 'staticColumn',
            width: '300px',
            render: <DemoStaticColumnComponent />,
            getCellProps() {
                return {
                    backgroundStyle: 'default',
                };
            },
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
            return {
                fontSize: '3xs',
                valign: null,
                padding: {
                    left: '2xs',
                    right: '2xs',
                },
                hoverBackgroundStyle: 'default',
                backgroundStyle,
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

function calcVerticalSeparators(quantum: TQuantumType): TSeparatorMode {
    return quantum === 'hour' ? 'line' : 'gap';
}

export default Object.assign(
    React.forwardRef(function DynamicGridSeparatorsDemo(
        props: TInternalProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const viewportWidth = 1300;
        const context = React.useContext(DataContext);
        const slice = context[STORE_ID] as unknown as ITimelineGridSliceState;
        const [verticalSeparators, setVerticalSeparators] = React.useState(
            calcVerticalSeparators(slice.quantum)
        );

        // Свойства, общие для всех строк.
        // Маркер, фон строки, вертикальные отступы, expanderSize настраиваются тут.
        const getRowProps = React.useCallback<TGetTreeRowPropsCallback>(
            (item: Model) => {
                return {
                    backgroundStyle: item.get(slice.nodeProperty) ? 'default' : 'unaccented',
                    withoutExpanderPadding:
                        item.get('type') === null && item.get('parent') === slice.root,
                    expanderSize: 'xl',
                };
            },
            [slice.nodeProperty, slice.root]
        );

        React.useEffect(() => {
            setVerticalSeparators(calcVerticalSeparators(slice.quantum));
        }, [slice.quantum]);

        return (
            <div
                className="controlsListsDemo__dynamicGridBase"
                style={{ width: `${viewportWidth}px` }}
                ref={ref}
            >
                <ScrollContainer
                    scrollOrientation={SCROLL_MODE.VERTICAL}
                    className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
                >
                    <TimelineGridConnectedComponent
                        className="controlsListsDemo__dynamicGridBase"
                        storeId={STORE_ID}
                        hoverMode={'none'}
                        showEditArrow={true}
                        eventRender={<DemoEventRenderComponent />}
                        viewportWidth={viewportWidth}
                        verticalSeparatorsMode={verticalSeparators}
                        horizontalSeparatorsMode={'gap'}
                        getRowProps={getRowProps}
                    />
                </ScrollContainer>
            </div>
        );
    }),
    {
        getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
            const holidaysConfig = getHolidayConfig();
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
                        navigation: {
                            source: 'position',
                            sourceConfig: {
                                field: 'key',
                                position: 1,
                                direction: 'bothways',
                                limit: 20,
                            },
                        },
                        cellsMultiSelectVisibility: 'hidden',
                        columnsNavigation: {
                            source: 'position',
                            sourceConfig: {
                                field: DYNAMIC_COLUMN_DATA_FIELD,
                            },
                        },
                        range: getInitialRange(),
                        staticColumns: getStaticColumns(),
                        dynamicColumn: getDynamicColumn(
                            generateHolidaysCalendar(CURRENT_DATE),
                            holidaysConfig
                        ),
                        staticHeaders: getStaticHeaders(),
                        // dynamicHeader: getDynamicHeader(),
                        holidaysConfig,
                        aggregationVisibility: 'hidden',
                        eventsProperty: 'EventRS',
                        eventStartProperty: 'DTStart',
                        eventEndProperty: 'DTEnd',
                    },
                },
            };
        },
    }
);
