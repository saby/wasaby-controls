/**
 * Базовое демо компонента "Таблица с загружаемыми колонками"
 */
import * as React from 'react';
import { IDynamicGridDataFactoryArguments } from 'Controls-Lists/dynamicGrid';
import { TimelineGridConnectedComponent, RangeSelectorConnectedComponent } from 'Controls-Lists/timelineGrid';
import { Container as ScrollContainer, SCROLL_MODE } from 'Controls/scroll';
import ExtMemory from './ExtMemory';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { NavigationComponent as ColumnScrollNavigationComponent } from 'Controls/columnScrollReact';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';
import { adapter } from 'Types/entity';
import DemoEventRenderComponent from './DemoEventRenderComponent';

function StaticHeaderRender(): React.ReactElement {
    return (
        <>
            <ColumnScrollNavigationComponent mode="arrows" />
            <RangeSelectorConnectedComponent
                storeId="DemoDynamicGridStore"
                fontColorStyle={'primary'}
            />
        </>
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
        render: <DemoDynamicColumnComponent />,
    };
}

function getEventsConfig(): {} {
    return {
        eventsProperty: 'EventRS',
        eventStartProperty: 'DTStart',
        eventEndProperty: 'DTEnd',
        render: <DemoEventRenderComponent />,
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

function isHolidayCallback(date: Date): boolean {
    const day = date.getDay();
    const SATURDAY = 6;
    const SUNDAY = 0;
    return day === SATURDAY || day === SUNDAY;
}

export default class Index extends React.Component {
    render() {
        return (
            <div
                className="controlsListsDemo__dynamicGridBase-scrollContainer"
                ref={this.props.forwardedRef}
            >
                <ScrollContainer scrollOrientation={SCROLL_MODE.VERTICAL}>
                    <TimelineGridConnectedComponent
                        className="controlsListsDemo__dynamicGridBase"
                        storeId="DemoDynamicGridStore"
                        isHolidayCallback={isHolidayCallback}
                    />
                </ScrollContainer>
            </div>
        );
    }

    static getLoadConfig(): Record<string, IDataConfig<IDynamicGridDataFactoryArguments>> {
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
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn(),
                    eventsConfig: getEventsConfig(),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: getDynamicHeader(),
                },
            },
        };
    }
}
