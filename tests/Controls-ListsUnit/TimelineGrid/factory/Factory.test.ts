import { TimelineGridFactory } from 'Controls-Lists/timelineGrid';
import { IRouter } from 'Router/router';
import { List as ListFactory } from 'Controls/dataFactory';
import { Memory } from 'Types/source';
import { adapter } from 'Types/entity';

const DataFactoryArguments = {
    source: new Memory({
        keyProperty: 'key',
        adapter: new adapter.Json(),
    }),
    range: { start: new Date(2023, 11, 7, 0, 0, 0, 0), end: new Date(2023, 11, 15, 0, 0, 0, 0) },
    columnsNavigation: {
        sourceConfig: {
            field: 'date',
        },
    },
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
    root: null,
    staticColumns: [{}],
    dynamicColumn: {},
    staticHeaders: [{}],
    dynamicHeader: {},
    eventsProperty: 'events',
};

describe('Controls-ListsUnit/TimelineGrid/factory/Factory', () => {
    test('loadData', async () => {
        const loadDynamicColumnsDataArguments = { deepScrollLoad: true };
        const dependenciesResults = {};
        const Router = {} as IRouter;

        const spyOnLoadData = jest.spyOn(ListFactory, 'loadData');
        spyOnLoadData.mockImplementation(() => Promise.resolve(null));

        await TimelineGridFactory.loadData(DataFactoryArguments, dependenciesResults, Router);

        expect(spyOnLoadData).toBeCalledTimes(1);
        expect(spyOnLoadData.mock.lastCall[0]).toMatchObject(loadDynamicColumnsDataArguments);
        expect(spyOnLoadData.mock.lastCall[1]).toStrictEqual(dependenciesResults);
        expect(spyOnLoadData.mock.lastCall[2]).toStrictEqual(Router);
        expect(spyOnLoadData.mock.lastCall[3]).toStrictEqual(true);

        const expectedColumnsNavigationFilterValue = {
            direction: 'forward',
            limit: 9,
            position: '2023-12-07 00:00:00+03',
            quantum: 'day',
            scale: 1,
        };

        const columnsNavigationFilterValue =
            spyOnLoadData.mock.lastCall[0].filter[
                DataFactoryArguments.columnsNavigation.sourceConfig.field
            ].getRawData();

        expect(columnsNavigationFilterValue).toEqual(expectedColumnsNavigationFilterValue);
    });
});
