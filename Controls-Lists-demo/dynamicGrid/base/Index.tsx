/**
 * Базовое демо компонента "Таблица с загружаемыми колонками"
 */
import * as React from 'react';
import DynamicGridComponent, {
    IDynamicGridDataFactoryArguments,
} from 'Controls-Lists/dynamicGrid';
import { Container as ScrollContainer } from 'Controls/scroll';
import ExtMemory from './ExtMemory';
import type { IDataConfig } from 'Controls/dataFactory';
import type { IColumnConfig } from 'Controls/gridReact';
import type { IHeaderCell } from 'Controls/grid';
import { NavigationComponent as ColumnScrollNavigationComponent } from 'Controls/columnScrollReact';
import DemoStaticColumnComponent from './DemoStaticColumnComponent';
import DemoDynamicColumnComponent from './DemoDynamicColumnComponent';
import 'css!Controls-Lists-demo/dynamicGrid/base/styles';

function StaticHeaderRender(): React.ReactElement {
    return <ColumnScrollNavigationComponent mode="arrows" />;
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
        width: '31px',
        render: <DemoDynamicColumnComponent />,
    };
}

function getStaticHeaders(): IHeaderCell[] {
    return [
        {
            key: 'staticHeader',
            render: <StaticHeaderRender />,
        },
    ];
}

function getDynamicHeader(): IHeaderCell {
    return {
        caption: 'ПН',
    };
}

export default class Index extends React.Component {
    render() {
        const ScrollContainerContent = (
            <DynamicGridComponent
                className="controlsListsDemo__dynamicGridBase"
                storeId="DemoDynamicGridStore"
            />
        );

        return (
            <div
                className="controlsListsDemo__dynamicGridBase-scrollContainer"
                ref={this.props.forwardedRef}
            >
                <ScrollContainer
                    content={ScrollContainerContent}
                    scrollOrientation="vertical"
                />
            </div>
        );
    }

    static getLoadConfig(): Record<
        string,
        IDataConfig<IDynamicGridDataFactoryArguments>
    > {
        return {
            DemoDynamicGridStore: {
                dataFactoryName:
                    'Controls-Lists/dynamicGrid:DynamicGridFactory',
                dataFactoryArguments: {
                    source: new ExtMemory({
                        data: [],
                        keyProperty: 'key',
                        generateColumnsData: false,
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
                            position: new Date(2023, 0, 0),
                            direction: 'bothways',
                            limit: 90,
                        },
                    },
                    staticColumns: getStaticColumns(),
                    dynamicColumn: getDynamicColumn(),
                    staticHeaders: getStaticHeaders(),
                    dynamicHeader: getDynamicHeader(),
                    dynamicColumnsSource: new ExtMemory({
                        data: [],
                        keyProperty: 'key',
                        generateColumnsData: true,
                    }),
                },
            },
        };
    }
}
