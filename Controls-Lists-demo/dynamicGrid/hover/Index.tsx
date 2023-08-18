import * as React from 'react';
import { IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';
import { TimelineGridConnectedComponent, IRange } from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import MulticoloredCell from './MulticoloredCell';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';
import ExtMemory from 'Controls-Lists-demo/dynamicGrid/base/ExtMemory';
import { adapter } from 'Types/entity';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

const TimelineGridConnectedComponentMemo = React.memo(TimelineGridConnectedComponent);
const STORE_ID = 'DemoHoverDynamicGridStore';

const getStaticColumns = (): IColumnConfig[] => {
    return [
        {
            key: 'subject',
            width: '100px',
            render: <MulticoloredCell />,
        },
    ];
};

const getDynamicColumn = (): IColumnConfig => {
    return {
        displayProperty: 'dynamicColumn',
        minWidth: '10px',
        getCellProps: (item) => {
            return {
                backgroundStyle: generateColor(),
                borderVisibility: 'hidden',
            };
        },
    };
};

const getInitialRange = (): IRange => {
    const currentDate = new Date(2023, 0, 1);

    return {
        start: BaseDateUtils.getStartOfMonth(currentDate),
        end: BaseDateUtils.getEndOfMonth(currentDate),
    };
};

const getStaticHeaders = (): IHeaderConfig[] => {
    return [
        {
            key: 'header-0',
            caption: 'День недели',
        },
    ];
};

const getDynamicHeader = (): IHeaderConfig => {
    return {};
};

function generateColor() {
    const backgroundStyles = [
        'default',
        'danger',
        'success',
        'warning',
        'primary',
        'secondary',
        'unaccented',
        'readonly',
        'info',
        'none',
    ];
    const rand = Math.floor(Math.random() * backgroundStyles.length);
    return backgroundStyles[rand];
}

const DemoIndex = React.forwardRef(function Index(props, ref) {
    const containerRef = React.useRef<HTMLDivElement>();
    return (
        <div
            className="controlsListsDemo__dynamicGridBase"
            ref={(el) => {
                ref?.(el);
                containerRef.current = el;
            }}
        >
            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridHover-scrollContainer'}
            >
                <TimelineGridConnectedComponentMemo
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    hoverMode={'filled-cross'}
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
                source: new ExtMemory({
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
