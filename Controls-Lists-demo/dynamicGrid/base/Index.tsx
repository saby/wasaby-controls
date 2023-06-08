/**
 * Базовое демо компонента "Таблица с загружаемыми колонками"
 */
import * as React from 'react';
import { IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';
import {
    TimelineGridConnectedComponent,
    RangeSelectorConnectedComponent,
    IHolidayData,
} from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import ExtMemory from './ExtMemory';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';
import { adapter } from 'Types/entity';
import DemoEventRenderComponent from './DemoEventRenderComponent';
import { DataContext } from 'Controls-DataEnv/context';

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

function getDynamicColumn(): IColumnConfig {
    return {
        displayProperty: 'dynamicTitle',
        minWidth: '20px',
        render: <DemoDynamicColumnComponent />,
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

function isHolidayCallback(date: Date): boolean | IHolidayData {
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

    const day = date.getDay();
    const SATURDAY = 6;
    const SUNDAY = 0;
    return day === SATURDAY || day === SUNDAY;
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

    return (
        <div
            className="controlsListsDemo__dynamicGridBase"
            ref={(el) => {
                forwardedRef?.(el);
                containerRef.current = el;
            }}
        >
            <div>{'лог:' + clickLog}</div>

            <ScrollContainer
                scrollOrientation={SCROLL_MODE.VERTICAL}
                className={'controlsListsDemo__dynamicGridBase-scrollContainer'}
            >
                <TimelineGridConnectedComponent
                    className="controlsListsDemo__dynamicGridBase"
                    storeId={STORE_ID}
                    isHolidayCallback={isHolidayCallback}
                    onDynamicColumnClick={onDynamicColumnClick}
                    onEventClick={onEventClick}
                    viewportWidth={containerRef.current?.offsetWidth || 1300}
                />
            </ScrollContainer>

            <div>
                <pre>selectedCells: {JSON.stringify(slice.state.selectedCells, null, 2)};</pre>
            </div>
        </div>
    );
});

Index.getLoadConfig = (): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> => {
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
                        field: 'dynamicColumnsData',
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
                dynamicColumn: getDynamicColumn(),
                staticHeaders: getStaticHeaders(),
                dynamicHeader: getDynamicHeader(),
            },
        },
    };
};

export default Index;
