/**
 * @jest-environment jsdom
 */

const MockedDynamicGridComponent = jest.fn();

jest.mock('Controls-Lists/_dynamicGrid/Component', () => {
    return {
        __esModule: true,
        DynamicGridComponent: (props) => {
            MockedDynamicGridComponent(props);
            return null;
        },
    };
});

import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { render } from '@testing-library/react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    TimelineGridConnectedComponent,
    getDynamicGridRowProps,
    prepareDynamicColumn,
} from 'Controls-Lists/timelineGrid';
import { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
import { DataContext } from 'Controls-DataEnv/context';

const STORE_ID = 'test_store';

const DYNAMIC_COLUMNS_COUNT = 5;

const STORE_VALUE = {
    viewMode: 'table',
    parentProperty: 'parent',
    nodeProperty: 'type',
    staticColumns: [
        {
            key: 'static_column',
        },
    ],
    endStaticColumns: [
        {
            key: 'end_static_column',
        },
    ],
    items: new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: 1,
                dynamicColumnsData: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        {
                            key: new Date(2023, 5, 15, 0, 0, 0, 0),
                            title: 'col_1',
                        },
                        {
                            key: new Date(2023, 5, 16, 0, 0, 0, 0),
                            title: 'col_2',
                        },
                        {
                            key: new Date(2023, 5, 17, 0, 0, 0, 0),
                            title: 'col_3',
                        },
                        {
                            key: new Date(2023, 5, 18, 0, 0, 0, 0),
                            title: 'col_4',
                        },
                        {
                            key: new Date(2023, 5, 19, 0, 0, 0, 0),
                            title: 'col_5',
                        },
                    ],
                }),
            },
        ],
    }),
    state: { columnsDataVersion: 0 },
    dynamicColumn: {},
    columnsNavigation: { sourceConfig: { limit: DYNAMIC_COLUMNS_COUNT } },
    staticHeaders: [
        {
            key: 'static_header',
        },
    ],
    endStaticHeaders: [
        {
            key: 'end_static_header',
        },
    ],
    dynamicHeader: {},
    staticFooter: [
        {
            key: 'static_footer',
        },
    ],
    dynamicFooter: {},
    range: {
        start: new Date(2023, 5, 15, 0, 0, 0, 0),
        end: new Date(2023, 5, 19, 0, 0, 0, 0),
    },
    dynamicColumnsGridData: [
        new Date(2023, 5, 15, 0, 0, 0, 0),
        new Date(2023, 5, 16, 0, 0, 0, 0),
        new Date(2023, 5, 17, 0, 0, 0, 0),
        new Date(2023, 5, 18, 0, 0, 0, 0),
        new Date(2023, 5, 19, 0, 0, 0, 0),
    ],
    columnsDataVersion: 7,
    multiSelectVisibility: 'visible',
    cellsMultiSelectVisibility: 'visible',
    cellsMultiSelectAccessibilityCallback: () => true,
    selectedCells: [],

    setRange: () => {},
    getLoadedRange: () => ({
        start: new Date(2023, 5, 15, 0, 0, 0, 0),
        end: new Date(2023, 5, 19, 0, 0, 0, 0),
    }),
    setAvailableRanges: () => {},
};

const CONTEXT_VALUE = { [STORE_ID]: STORE_VALUE };

function getConnectedComponent(props) {
    return (
        <DataContext.Provider value={CONTEXT_VALUE}>
            <TimelineGridConnectedComponent {...props} />
        </DataContext.Provider>
    );
}

describe('Controls-ListsUnit/TimelineGrid/ConnectedComponent', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    test('Passing parameters to dynamicGrid:DynamicGridComponent', () => {
        const componentProps = {
            storeId: STORE_ID,
            eventRender: () => null,
            eventsProperty: 'testEventsProperty',
            eventStartProperty: 'testEventStartProperty',
            eventEndProperty: 'testEventEndProperty',
            hoverMode: 'cross',
            viewportWidth: 1000,
        };
        render(getConnectedComponent(componentProps), {
            container,
        });

        expect(MockedDynamicGridComponent).toHaveBeenCalledWith(
            expect.objectContaining({
                eventRender: componentProps.eventRender,
                eventsProperty: componentProps.eventsProperty,
                eventStartProperty: componentProps.eventStartProperty,
                eventEndProperty: componentProps.eventEndProperty,
                hoverMode: componentProps.hoverMode,

                viewMode: STORE_VALUE.viewMode,
                viewportWidth: 1000,
                dynamicColumnsCount: DYNAMIC_COLUMNS_COUNT,
                range: STORE_VALUE.range,
                dynamicColumnsGridData: STORE_VALUE.dynamicColumnsGridData,
                columnsDataVersion: STORE_VALUE.columnsDataVersion,
                multiSelectVisibility: STORE_VALUE.multiSelectVisibility,
                cellsMultiSelectVisibility: STORE_VALUE.cellsMultiSelectVisibility,
                cellsMultiSelectAccessibilityCallback:
                    STORE_VALUE.cellsMultiSelectAccessibilityCallback,
                selectedCells: STORE_VALUE.selectedCells,
            })
        );
    });

    test('prepareDynamicColumn default params for hoverMode="cross"', () => {
        const columnParams = prepareDynamicColumn({
            dynamicColumn: {} as IDynamicColumnConfig<Date>,
            columnWidth: 0,
            dataDensity: undefined,
            hoverMode: 'cross',
        });
        const cellProps = columnParams.getCellProps({} as Model, new Date());
        expect(cellProps.topLeftBorderRadius).toBeNull();
        expect(cellProps.topRightBorderRadius).toBeNull();
        expect(cellProps.bottomRightBorderRadius).toBeNull();
        expect(cellProps.bottomLeftBorderRadius).toBeNull();
        expect(cellProps.borderVisibility).toBe('hidden');
    });

    test('prepareDynamicColumn default params for hoverMode="cell"', () => {
        const columnParams = prepareDynamicColumn({
            dynamicColumn: {} as IDynamicColumnConfig<Date>,
            columnWidth: 0,
            dataDensity: undefined,
            hoverMode: 'cell',
        });
        const cellProps = columnParams.getCellProps({} as Model, new Date());
        expect(cellProps.topLeftBorderRadius).toBe('s');
        expect(cellProps.topRightBorderRadius).toBe('s');
        expect(cellProps.bottomRightBorderRadius).toBe('s');
        expect(cellProps.bottomLeftBorderRadius).toBe('s');
        expect(cellProps.borderVisibility).toBe('onhover');
    });

    test('getDynamicGridRowProps default params for hoverMode="cross"', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {};
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'gap',
            hoverMode: 'cross',
        });
        expect(rowProps.borderVisibility).toBe('hidden');
    });

    test('getDynamicGridRowProps default params for hoverMode="cell"', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {};
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'gap',
            hoverMode: 'cell',
        });
        expect(rowProps.borderVisibility).toBe('hidden');
    });

    test('getDynamicGridRowProps default params for horizontalSeparatorsMode="line"', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {};
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'line',
            hoverMode: 'cross',
        });
        expect(rowProps.borderVisibility).toBe('hidden');
    });

    test('default vertical offsets with horizontalSeparatorsMode="gap"', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {};
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'gap',
            hoverMode: 'cross',
        });
        expect(rowProps.padding?.top).toBe('dynamic-grid_3xs');
        expect(rowProps.padding?.bottom).toBe('null');
    });

    test('default vertical offsets with horizontalSeparatorsMode="line"', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {};
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'line',
            hoverMode: 'cross',
        });
        expect(rowProps.padding?.top).toBe('null');
        expect(rowProps.padding?.bottom).toBe('null');
    });

    test('custom vertical offsets', () => {
        const rowProps = getDynamicGridRowProps({
            getRowProps: () => {
                return {
                    padding: {
                        top: 'm',
                        bottom: 'l',
                    },
                };
            },
            item: {} as Model,
            horizontalSeparatorsMode: 'gap',
            hoverMode: 'cross',
        });
        expect(rowProps.padding?.top).toBe('dynamic-grid_m');
        expect(rowProps.padding?.bottom).toBe('dynamic-grid_l');
    });
});
