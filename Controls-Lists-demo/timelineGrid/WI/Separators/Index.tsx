import * as React from 'react';
import { adapter, Model } from 'Types/entity';
import { TInternalProps } from 'UICore/Executor';
import { IDynamicColumnConfig, TQuantumType } from 'Controls-Lists/dynamicGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import {
    ITimelineGridDataFactoryArguments,
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    IRange,
    TSeparatorMode,
    ITimelineGridSliceState,
} from 'Controls-Lists/timelineGrid';

import ExtMemory from '../Data/ExtMemory';
import DemoStaticColumnComponent from './renders/DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './renders/DemoDynamicColumnComponent';

import 'css!Controls-Lists-demo/timelineGrid/WI/Data/styles';
import { DataContext } from 'Controls-DataEnv/context';

const STORE_ID = 'DemoDynamicGridStore';
const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';

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

function calcVerticalSeparators(quantum: TQuantumType): TSeparatorMode {
    return quantum === 'hour' ? 'line' : 'gap';
}

function TimelineGridDemo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const context = React.useContext(DataContext);
    const slice = context[STORE_ID] as unknown as ITimelineGridSliceState;
    const verticalSeparators = React.useMemo(() => {
        return calcVerticalSeparators(slice.quantum);
    }, [slice.quantum]);

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
                    verticalSeparatorsMode={verticalSeparators}
                    horizontalSeparatorsMode={'gap'}
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
                    dynamicColumn: getDynamicColumn(),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: {},
                },
            },
        };
    },
});
