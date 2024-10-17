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

import { ConnectedComponent } from 'Controls-Lists/dynamicGrid';
import { DataContext } from 'Controls-DataEnv/context';

const STORE_ID = 'test_store';

const DYNAMIC_COLUMNS_COUNT = 10;

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
    dynamicColumnsGridData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    columnsDataVersion: 7,
    multiSelectVisibility: 'visible',
    cellsMultiSelectVisibility: 'visible',
    cellsMultiSelectAccessibilityCallback: () => true,
    selectedCells: [],
};

const CONTEXT_VALUE = { [STORE_ID]: STORE_VALUE };

function getConnectedComponent(props) {
    return (
        <DataContext.Provider value={CONTEXT_VALUE}>
            <ConnectedComponent {...props} />
        </DataContext.Provider>
    );
}

describe('Controls-ListsUnit/DynamicGrid/ConnectedComponent', () => {
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

                viewMode: STORE_VALUE.viewMode,
                staticColumns: STORE_VALUE.staticColumns,
                endStaticColumns: STORE_VALUE.endStaticColumns,
                dynamicColumn: STORE_VALUE.dynamicColumn,
                dynamicColumnsCount: DYNAMIC_COLUMNS_COUNT,
                staticHeaders: STORE_VALUE.staticHeaders,
                endStaticHeaders: STORE_VALUE.endStaticHeaders,
                dynamicHeader: STORE_VALUE.dynamicHeader,
                staticFooter: STORE_VALUE.staticFooter,
                dynamicFooter: STORE_VALUE.dynamicFooter,
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
});
