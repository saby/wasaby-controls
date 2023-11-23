import * as React from 'react';
import { IDynamicGridDataFactoryArguments, THoverMode } from 'Controls-Lists/dynamicGrid';
import { TimelineGridConnectedComponent, IRange } from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import DayCell from './DayCell';
import 'css!Controls-Lists-demo/dynamicGrid/hover/style';
import HoverMemory from 'Controls-Lists-demo/dynamicGrid/hover/hoverMemory';
import { adapter, Model } from 'Types/entity';
import TemperatureCell from 'Controls-Lists-demo/dynamicGrid/hover/TemperatureCell';

const TimelineGridConnectedComponentMemo = React.memo(TimelineGridConnectedComponent);
const STORE_ID = 'DemoHoverDynamicGridStore';

const getStaticColumns = (): IColumnConfig[] => {
    return [
        {
            key: 'subject',
            width: '100px',
            render: <DayCell />,
        },
    ];
};

const getDynamicColumn = (): IColumnConfig => {
    return {
        displayProperty: 'dynamicColumn',
        minWidth: '20px',
        render: <TemperatureCell />,
        getCellProps: (item: Model, date: Date) => {
            const cellColor =
                backgroundStyles[
                    (Math.pow(date.getHours(), 2) +
                        Math.pow(date.getHours(), 3) * Number(item.getKey())) %
                        backgroundStyles.length
                ];
            return {
                borderVisibility: 'hidden',
                backgroundStyle: cellColor,
            };
        },
    };
};

const getInitialRange = (): IRange => {
    return {
        start: new Date(2023, 0, 1, 0, 0),
        end: new Date(2023, 0, 1, 14, 0),
    };
};

const getStaticHeaders = (): IHeaderConfig[] => {
    return [
        {
            key: 'header-0',
            caption: 'По часам',
        },
    ];
};

const getDynamicHeader = (): IHeaderConfig => {
    return {};
};

const backgroundStyles = [
    'hoverDemo_yellow',
    'hoverDemo_green',
    'hoverDemo_red',
    'hoverDemo_orange',
    'hoverDemo_salat',
];

const DemoIndex = React.forwardRef(function Index(props, ref) {
    const containerRef = React.useRef<HTMLDivElement>();
    const [hoverMode, setHoverMode] = React.useState<THoverMode>('cross');

    const toggleHoverMode = React.useCallback(() => {
        if (hoverMode === 'cross') {
            setHoverMode('none');
        } else if (hoverMode === 'none') {
            setHoverMode('cross');
        }
    }, [hoverMode]);
    return (
        <div
            className="controlsListsDemo__dynamicGridBase"
            ref={(el) => {
                ref?.(el);
                containerRef.current = el;
            }}
        >
            <button onClick={() => toggleHoverMode()}>{`Режим ховера: ${hoverMode}`}</button>
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridHover-scrollContainer'}
            >
                <TimelineGridConnectedComponentMemo
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    hoverMode={hoverMode}
                    viewportWidth={containerRef.current?.offsetWidth || 1300}
                />
            </ScrollContainer>
        </div>
    );
});

DemoIndex.getLoadConfig = (): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> => {
    return {
        DemoHoverDynamicGridStore: {
            dataFactoryName: 'Controls-Lists/timelineGrid:TimelineGridFactory',
            dataFactoryArguments: {
                source: new HoverMemory({
                    keyProperty: 'key',
                    adapter: new adapter.Sbis(),
                }),
                keyProperty: 'key',
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
                        field: 'dynamicColumnsData',
                    },
                },
                range: getInitialRange(),
                staticColumns: getStaticColumns(),
                dynamicColumn: getDynamicColumn(),
                staticHeaders: getStaticHeaders(),
                dynamicHeader: getDynamicHeader(),
            },
        },
    };
};

export default DemoIndex;
