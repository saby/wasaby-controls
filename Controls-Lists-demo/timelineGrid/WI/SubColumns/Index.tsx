import * as React from 'react';
import { Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { IDynamicColumnConfig, IDynamicHeaderConfig } from 'Controls-Lists/dynamicGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    ITimelineGridDataFactoryArguments,
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    IRange,
} from 'Controls-Lists/timelineGrid';

import 'css!Controls-Lists-demo/timelineGrid/WI/Data/styles';
import {
    DynamicColumnsRenderComponent,
    DynamicHeaderRenderComponent,
    StaticColumnRenderComponent,
} from 'Controls-Lists-demo/dynamicGrid/WI/SubColumns/renders';
import ExtSource from 'Controls-Lists-demo/dynamicGrid/WI/SubColumns/source';

const STORE_ID = 'DemoDynamicGridStore';
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

const CURRENT_DATE = new Date(2023, 0, 13);
const END_DATE = new Date(2023, 0, 16);

function getInitialRange(): IRange {
    return {
        start: CURRENT_DATE,
        end: END_DATE,
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
            render: React.createElement(StaticColumnRenderComponent),
        },
    ];
}

function getDynamicColumn(): IDynamicColumnConfig<Date> {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DynamicColumnsRenderComponent />,
        getCellProps: (item: Model, date: Date) => {
            return {
                fontSize: '3xs',
                valign: null,
                padding: {
                    left: '2xs',
                    right: '2xs',
                },
            };
        },
        subColumns: [
            {
                key: 'success',
                render: <DynamicColumnsRenderComponent />,
            },
            {
                key: 'danger',
                render: <DynamicColumnsRenderComponent />,
            },
        ],
    };
}

function getDynamicHeader(): IDynamicHeaderConfig {
    return {
        render: <DynamicHeaderRenderComponent />,
        superHeaders: [
            {
                key: 'Super',
                colspanCallback: () => 1,
                getCellProps: () => {
                    return {
                        halign: 'center',
                        backgroundColorStyle: 'default',
                    };
                },
                render: <DynamicHeaderRenderComponent caption={'Super'} />,
            },
        ],
        getCellProps() {
            return {
                backgroundStyle: 'default',
            };
        },
        subHeaders: [
            {
                key: 'Success',
                getCellProps() {
                    return {
                        backgroundStyle: 'default',
                    };
                },
                render: <DynamicHeaderRenderComponent caption={'План'} />,
            },
            {
                key: 'Danger',
                getCellProps() {
                    return {
                        backgroundStyle: 'default',
                    };
                },
                render: <DynamicHeaderRenderComponent caption={'Факт'} />,
            },
        ],
    };
}

function getStaticHeaders(): IHeaderConfig[] {
    return [
        {
            key: 'staticHeader',
            render: <StaticHeaderRender />,
            getCellProps() {
                return {
                    backgroundStyle: 'default',
                };
            },
        },
    ];
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
                    hoverMode={'cell'}
                    verticalSeparatorsMode={'line'}
                    horizontalSeparatorsMode={'line'}
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
                    source: new ExtSource({
                        keyProperty: 'key',
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
                    dynamicColumn: getDynamicColumn(),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: getDynamicHeader(),
                },
            },
        };
    },
});
