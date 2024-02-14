import * as React from 'react';
import { adapter, Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import { MultiSelectAccessibility } from 'Controls/display';
import { DataContext } from 'Controls-DataEnv/context';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    ITimelineGridDataFactoryArguments,
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    IRange,
} from 'Controls-Lists/timelineGrid';

import ExtMemory from '../Data/ExtMemory';
import DemoStaticColumnComponent from './renders/DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './renders/DemoDynamicColumnComponent';

import 'css!Controls-Lists-demo/timelineGrid/WI/Data/styles';

const STORE_ID = 'DemoDynamicGridStore';
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

function getInitialRange(): IRange {
    return {
        start: new Date(2023, 0, 1),
        end: new Date(2023, 0, 16),
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
            render: React.createElement(DemoStaticColumnComponent),
        },
    ];
}

function getDynamicColumn(): IDynamicColumnConfig<Date> {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DemoDynamicColumnComponent />,
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

function TimelineGridDemo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const slice = React.useContext(DataContext)[STORE_ID];
    React.useEffect(() => {
        slice.setState({
            selectedCells: {
                0: [
                    'Fri, 06 Jan 2023 21:00:00 GMT',
                    'Sat, 07 Jan 2023 21:00:00 GMT',
                    'Sun, 08 Jan 2023 21:00:00 GMT',
                ],
                1: [
                    'Fri, 06 Jan 2023 21:00:00 GMT',
                    'Sat, 07 Jan 2023 21:00:00 GMT',
                    'Sun, 08 Jan 2023 21:00:00 GMT',
                ],
                3: [
                    'Fri, 06 Jan 2023 21:00:00 GMT',
                    'Sat, 07 Jan 2023 21:00:00 GMT',
                    'Sun, 08 Jan 2023 21:00:00 GMT',
                ],
            },
        });
    }, []);

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
                    displayProperty: 'fullName',
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
                    dynamicHeader: {},
                    cellsMultiSelectAccessibilityCallback: (itemKey, columnKey) => {
                        return itemKey === 2 &&
                            new Date(columnKey) !== new Date('Sat, 07 Jan 2023 21:00:00 GMT')
                            ? MultiSelectAccessibility.disabled
                            : MultiSelectAccessibility.enabled;
                    },
                },
            },
        };
    },
});
