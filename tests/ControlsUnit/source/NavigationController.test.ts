import { RecordSet } from 'Types/collection';
import { NavigationController } from 'Controls/dataSource';
import { IBasePageSourceConfig } from 'Controls/interface';
import { relation } from 'Types/entity';
const dataPrev = [
    {
        id: 1,
        title: 'Первый',
        type: 1,
    },
    {
        id: 2,
        title: 'Второй',
        type: 2,
    },
    {
        id: 3,
        title: 'Третий',
        type: 2,
    },
];

const data = [
    {
        id: 4,
        title: 'Четвертый',
        type: 1,
        parId: 7,
    },
    {
        id: 5,
        title: 'Пятый',
        type: 2,
        parId: 8,
    },
    {
        id: 6,
        title: 'Шестой',
        type: 2,
        parId: 9,
    },
];

const dataNext = [
    {
        id: 7,
        title: 'Седьмой',
        type: 1,
    },
    {
        id: 8,
        title: 'Восьмой',
        type: 2,
    },
    {
        id: 9,
        title: 'Девятый',
        type: 2,
    },
];

const defFilter = { a: 'a', b: 'b' };
const defSorting = [{ x: 'DESC' }, { y: 'ASC' }];
const TEST_PAGE_SIZE = 3;

describe('Controls/_source/NavigationController', () => {
    describe('Page navigation', () => {
        describe('Without config', () => {
            it('getQueryParams root', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(TEST_PAGE_SIZE).toEqual(params.limit);
                expect(0).toEqual(params.offset);
            });

            it('getQueryParams root + forward', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const params = nc.getQueryParams(
                    { filter: defFilter, sorting: defSorting },
                    null,
                    {},
                    'forward'
                );
                expect(TEST_PAGE_SIZE).toEqual(params.limit);
                expect(TEST_PAGE_SIZE).toEqual(params.offset);
            });

            it('getQueryParams root + backward', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 2,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const params = nc.getQueryParams(
                    { filter: defFilter, sorting: defSorting },
                    null,
                    {},
                    'backward'
                );
                expect(TEST_PAGE_SIZE).toEqual(params.limit);
                expect(TEST_PAGE_SIZE).toEqual(params.offset);
            });

            it('updateQueryProperties root', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const params = nc.updateQueryProperties(rs);
                expect(1).toEqual(params[0].nextPage);
                expect(-1).toEqual(params[0].prevPage);
            });

            it('updateQueryProperties root + forward', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const params = nc.updateQueryProperties(
                    rs,
                    null,
                    undefined,
                    'forward'
                );
                expect(START_PAGE + 2).toEqual(params[0].nextPage);
                expect(START_PAGE - 1).toEqual(params[0].prevPage);
            });

            it('updateQueryProperties root + backward', () => {
                const START_PAGE = 2;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const params = nc.updateQueryProperties(
                    rs,
                    null,
                    undefined,
                    'backward'
                );
                expect(START_PAGE + 1).toEqual(params[0].nextPage);
                expect(START_PAGE - 2).toEqual(params[0].prevPage);
            });
            it('updateQueryProperties config', () => {
                const START_PAGE = 2;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: 10 });
                let params = nc.updateQueryProperties(
                    rs,
                    null,
                    { page: 1, pageSize: TEST_PAGE_SIZE * 2 },
                    null
                );
                expect(4).toEqual(params[0].nextPage);
                expect(3).toEqual(params[0].page);
                expect(1).toEqual(params[0].prevPage);

                params = nc.updateQueryProperties(
                    rs,
                    null,
                    { page: 0, pageSize: TEST_PAGE_SIZE * 2 },
                    null
                );
                expect(2).toEqual(params[0].nextPage);
                expect(0).toEqual(params[0].page);
                expect(-1).toEqual(params[0].prevPage);
            });
            it('updateQueryProperties config and empty result', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                });
                rs.setMetaData({ more: 0 });
                const params = nc.updateQueryProperties(
                    rs,
                    null,
                    { page: 0, pageSize: TEST_PAGE_SIZE },
                    null
                );
                expect(1).toEqual(params[0].nextPage);
                expect(0).toEqual(params[0].page);
                expect(-1).toEqual(params[0].prevPage);
            });

            it('hasMoreData undefined false root', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData integer false root', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: 3 });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData integer true root', () => {
                const START_PAGE = 2;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: 10 });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(true);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(true);
            });

            it('hasMoreData boolean true root', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: false });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData (hasMore is undefined) boolean true root', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: false });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('navigationParamsChangedCallback called with new params', () => {
                const START_PAGE = 0;
                let newNavigationParams;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                    },
                    navigationParamsChangedCallback: (newParams) => {
                        newNavigationParams = newParams;
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });
                nc.updateQueryProperties(rs);
                nc.getQueryParams({ filter: {} }, null, null, 'forward');
                expect(
                    newNavigationParams.page === START_PAGE + 1
                ).toBeTruthy();
                expect(
                    newNavigationParams.pageSize === TEST_PAGE_SIZE
                ).toBeTruthy();
            });
        });
    });
    describe('Position navigation', () => {
        describe('Without config', () => {
            it('getQueryParams compatible direction=bothways', () => {
                const QUERY_LIMIT = 3;
                let nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'both',
                        limit: QUERY_LIMIT,
                    },
                });

                let params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(1).toEqual(params.filter['id~']);
                expect(QUERY_LIMIT).toEqual(params.limit);

                nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'after',
                        limit: 3,
                    },
                });

                params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(1).toEqual(params.filter['id>=']);

                nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'before',
                        limit: 3,
                    },
                });

                params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(1).toEqual(params.filter['id<=']);
            });

            it('getQueryParams root direction=bothways', () => {
                const QUERY_LIMIT = 3;
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: null,
                        field: 'id',
                        direction: 'bothways',
                        limit: QUERY_LIMIT,
                    },
                });

                const params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(null).toEqual(params.filter['id~']);
                expect(QUERY_LIMIT).toEqual(params.limit);
            });

            it('getQueryParams root direction=forward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'forward',
                        limit: 3,
                    },
                });

                const params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(1).toEqual(params.filter['id>=']);
            });

            it('getQueryParams root direction=backward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'backward',
                        limit: 3,
                    },
                });

                const params = nc.getQueryParams({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(1).toEqual(params.filter['id<=']);
            });

            it('getQueryParams root direction=bothways load forward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'bothways',
                        limit: 3,
                    },
                });

                // if it is first call without updateQueryProperties before it, position should be null
                // because backwardPosition isn't initialized
                const params = nc.getQueryParams(
                    { filter: defFilter, sorting: defSorting },
                    null,
                    {},
                    'forward'
                );
                expect(null).toEqual(params.filter['id>=']);
            });

            it('getQueryParams root direction=bothways load backward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'bothways',
                        limit: 3,
                    },
                });

                // if it is first call without updateQueryProperties before it, position should be null
                // because backwardPosition isn't initialized
                const params = nc.getQueryParams(
                    { filter: defFilter, sorting: defSorting },
                    null,
                    {},
                    'backward'
                );
                expect(null).toEqual(params.filter['id<=']);
            });

            it('getQueryParams with config', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'bothways',
                        limit: 3,
                    },
                });

                const params = nc.getQueryParams(
                    {
                        filter: defFilter,
                    },
                    null,
                    {
                        direction: 'bothways',
                        field: 'id',
                        limit: 5,
                        position: 'testPosition',
                    }
                );
                expect(params.filter['id~']).toEqual('testPosition');
                expect(params.limit).toEqual(5);
            });

            it('updateQueryProperties root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                let params = nc.updateQueryProperties(rs);
                expect([6]).toEqual(params[0].forwardPosition);
                expect([4]).toEqual(params[0].backwardPosition);

                const rsforward = new RecordSet({
                    rawData: dataNext,
                    keyProperty: 'id',
                });

                params = nc.updateQueryProperties(
                    rsforward,
                    null,
                    undefined,
                    'forward'
                );
                expect([9]).toEqual(params[0].forwardPosition);
                expect([4]).toEqual(params[0].backwardPosition);

                const rsbackward = new RecordSet({
                    rawData: dataPrev,
                    keyProperty: 'id',
                });

                params = nc.updateQueryProperties(
                    rsbackward,
                    null,
                    undefined,
                    'backward'
                );
                expect([9]).toEqual(params[0].forwardPosition);
                expect([1]).toEqual(params[0].backwardPosition);
            });

            it('updateQueryProperties compatible + meta.NextPosition root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ nextPosition: { before: [-1], after: [10] } });

                const params = nc.updateQueryProperties(rs);
                expect([10]).toEqual(params[0].forwardPosition);
                expect([-1]).toEqual(params[0].backwardPosition);
            });

            it('updateQueryProperties + meta.NextPosition recordSet', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const metaMoreRs = new RecordSet({
                    rawData: [
                        {
                            id: 1,
                            nav_result: { before: [-1], after: [10] },
                        },
                        {
                            id: 2,
                            nav_result: { before: [1], after: [11] },
                        },
                    ],
                    keyProperty: 'id',
                });
                const nextPositionRs = new RecordSet({
                    rawData: [
                        {
                            id: 1,
                            nav_result: { before: [-1], after: [10] },
                        },
                        {
                            id: 2,
                            nav_result: { before: [1], after: [11] },
                        },
                    ],
                    keyProperty: 'anyKeyProperty',
                });

                rs.setMetaData({
                    more: metaMoreRs,
                    nextPosition: nextPositionRs,
                });

                const params = nc.updateQueryProperties(rs);
                expect([10]).toEqual(params[0].forwardPosition);
                expect([-1]).toEqual(params[0].backwardPosition);
                expect([11]).toEqual(params[1].forwardPosition);
                expect([1]).toEqual(params[1].backwardPosition);
            });

            it('updateQueryProperties + meta.NextPosition recordSet, direction: forward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const metaMoreRs = new RecordSet({
                    rawData: [
                        {
                            id: 0,
                            nav_result: 'testId',
                        },
                        {
                            id: 2,
                            nav_result: null,
                        },
                    ],
                    keyProperty: 'id',
                });
                const nextPositionRs = new RecordSet({
                    rawData: [
                        {
                            id: 0,
                            nav_result: ['testId'],
                        },
                        {
                            id: 2,
                            nav_result: null,
                        },
                    ],
                    keyProperty: 'anyKeyProperty',
                });

                rs.setMetaData({
                    more: metaMoreRs,
                    nextPosition: nextPositionRs,
                });

                const params = nc.updateQueryProperties(rs);
                expect(['testId']).toEqual(params[0].forwardPosition);
                expect([6]).toEqual(params[1].forwardPosition);
            });

            it('updateQueryProperties bothways + meta.NextPosition root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({
                    nextPosition: { backward: [-1], forward: [10] },
                });

                const params = nc.updateQueryProperties(rs);
                expect([10]).toEqual(params[0].forwardPosition);
                expect([-1]).toEqual(params[0].backwardPosition);
            });

            it('updateQueryProperties forward + meta.NextPosition root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ nextPosition: [10] });

                const params = nc.updateQueryProperties(rs);
                expect([10]).toEqual(params[0].forwardPosition);
            });

            it('updateQueryProperties forward + meta.NextPosition root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'backward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ nextPosition: [-1] });

                const params = nc.updateQueryProperties(rs);
                expect([-1]).toEqual(params[0].backwardPosition);
            });

            it('updateQueryProperties forward + meta.iterative changed', () => {
                function getNavController() {
                    return new NavigationController({
                        navigationType: 'position',
                        navigationConfig: {
                            field: 'id',
                            direction: 'forward',
                        },
                    });
                }
                let nc = getNavController();

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ nextPosition: null, iterative: false });
                let params = nc.updateQueryProperties(
                    rs,
                    null,
                    null,
                    'forward'
                );
                expect([6]).toEqual(params[0].forwardPosition);

                rs.setMetaData({ nextPosition: null, iterative: true });
                params = nc.updateQueryProperties(rs, null, null, 'forward');
                expect([null]).toEqual(params[0].forwardPosition);

                nc = getNavController();
                rs.setMetaData({ iterative: true });
                params = nc.updateQueryProperties(rs, null, null, 'forward');
                expect([6]).toEqual(params[0].forwardPosition);
            });

            it('updateQueryProperties + multiNavigaion', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: dataPrev.concat(data).concat(dataNext),
                    keyProperty: 'id',
                });

                let navigationRs = new RecordSet({
                    rawData: [
                        {
                            id: 7,
                            nav_result: true,
                        },
                        {
                            id: 1,
                            nav_result: true,
                        },
                    ],
                });

                const hierarchyRelation = new relation.Hierarchy({
                    parentProperty: 'parId',
                    keyProperty: 'id',
                });
                rs.setMetaData({ more: navigationRs });
                const params = nc.updateQueryProperties(
                    rs,
                    null,
                    null,
                    void 0,
                    hierarchyRelation
                );
                expect([4]).toEqual(params[0].forwardPosition);
                expect(nc.hasLoaded(7)).toBe(true);
                expect(nc.hasLoaded(1)).toBe(true);

                navigationRs = new RecordSet({
                    rawData: [
                        {
                            id: 1,
                            nav_result: true,
                        },
                    ],
                });
                rs.setMetaData({ more: navigationRs });
                nc.updateQueryProperties(
                    rs,
                    null,
                    null,
                    void 0,
                    hierarchyRelation
                );
                expect(nc.hasLoaded(7)).toBe(false);
                expect(nc.hasLoaded(1)).toBe(true);
            });

            it('updateQueryProperties for node, limit in config, direction: forward', () => {
                const QUERY_LIMIT = 3;
                const NODE_ID = 7;
                const navigController = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                        limit: QUERY_LIMIT,
                    },
                });

                const rs = new RecordSet({
                    rawData: [
                        {
                            id: 4,
                            title: 'Четвертый',
                            type: 1,
                            parId: 7,
                        },
                    ],
                    keyProperty: 'id',
                });

                const hierarchyRelation = new relation.Hierarchy({
                    parentProperty: 'parId',
                    keyProperty: 'id',
                });
                rs.setMetaData({ more: true });
                const params = navigController.updateQueryProperties(
                    rs,
                    NODE_ID,
                    null,
                    'forward',
                    hierarchyRelation,
                    false
                );
                expect(QUERY_LIMIT + rs.getCount()).toEqual(params[0].limit);
            });

            it('updateQueryRange + edge forward position', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    keyProperty: 'id',
                });
                const navigationConfig = {
                    field: 'id',
                    direction: 'forward',
                    position: [-1],
                };

                rs.setMetaData({ more: true });
                nc.updateQueryProperties(rs, null, navigationConfig);
                expect(nc.hasMoreData('forward')).toBe(false);
                expect(nc.hasMoreData('backward')).toBe(true);
            });

            it('updateQueryRange', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ nextPosition: null, iterative: false });
                nc.updateQueryProperties(rs, null, null, 'forward');
                nc.updateQueryRange(rs, null, rs.at(0), rs.at(2));

                const params = nc.getQueryParams(
                    { filter: {} },
                    null,
                    null,
                    'forward'
                );
                expect(6).toEqual(params.filter['id>=']);
            });

            it('hasMoreData botways compatible values false root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });
                let hasMore;

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: { before: true, after: false } });
                nc.updateQueryProperties(rs);
                hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(true);

                rs.setMetaData({ more: { before: false, after: false } });
                nc.updateQueryProperties(rs);
                hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData bothways values false root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'bothways',
                    },
                });
                let hasMore;

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: { backward: true, forward: false } });
                nc.updateQueryProperties(rs);
                hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(true);

                rs.setMetaData({ more: { backward: false, forward: false } });
                nc.updateQueryProperties(rs);
                hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData forward values false root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: true });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(true);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(false);
            });

            it('hasMoreData forward values false root', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'backward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: true });

                const params = nc.updateQueryProperties(rs);
                let hasMore = nc.hasMoreData('forward');
                expect(hasMore).toBe(false);
                hasMore = nc.hasMoreData('backward');
                expect(hasMore).toBe(true);
            });

            it('navigationParamsChangedCallback called with new params', () => {
                const QUERY_LIMIT = 3;
                let newNavigationParams;
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: null,
                        field: 'id',
                        direction: 'forward',
                        limit: QUERY_LIMIT,
                    },
                    navigationParamsChangedCallback: (newParams) => {
                        newNavigationParams = newParams;
                    },
                });
                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: true });
                nc.updateQueryProperties(rs);
                nc.getQueryParams({ filter: {} }, null, null, 'forward');

                expect(newNavigationParams.limit === QUERY_LIMIT).toBeTruthy();
                expect(newNavigationParams.position).toEqual([6]);
            });
        });
    });
    describe('Both navigation types + multiroot', () => {
        describe('getQueryParams', () => {
            it('Page', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                // creating some stores in Navigation controller
                nc.getQueryParams({}, '1');
                nc.getQueryParams({}, '2');

                let params = nc.getQueryParamsForHierarchy({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(2).toEqual(params.length);
                expect('1').toEqual(params[0].filter.__root.valueOf());
                expect('2').toEqual(params[1].filter.__root.valueOf());

                params = nc.getQueryParamsForHierarchy(
                    { filter: defFilter, sorting: defSorting },
                    void 0,
                    true,
                    ['3']
                );
                expect(1).toEqual(params.length);

                params = nc.getQueryParamsForHierarchy(
                    { filter: defFilter, sorting: defSorting },
                    void 0,
                    true,
                    ['1', '2', '3']
                );
                expect(3).toEqual(params.length);

                params = nc.getQueryParamsForHierarchy(
                    { filter: defFilter, sorting: defSorting },
                    void 0,
                    true,
                    ['1', '2', '3']
                );
                expect(3).toEqual(params.length);
            });

            it('Page + do not reset navigation', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                    },
                });

                // creating some stores in Navigation controller
                nc.getQueryParams({}, '1');
                nc.getQueryParams({}, '2');

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });
                rs.setMetaData({ more: true });
                nc.updateQueryProperties(rs, '1', null, 'forward', null, false);

                const params = nc.getQueryParamsForHierarchy(
                    { filter: defFilter, sorting: defSorting },
                    null,
                    false
                );
                expect(2).toEqual(params.length);
                expect('1').toEqual(params[0].filter.__root.valueOf());
                expect(TEST_PAGE_SIZE * 2).toEqual(params[0].limit);
                expect('2').toEqual(params[1].filter.__root.valueOf());
                expect(TEST_PAGE_SIZE).toEqual(params[1].limit);
            });

            it('Position', () => {
                const QUERY_LIMIT = 3;
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'both',
                        limit: QUERY_LIMIT,
                    },
                });

                // creating some stores in Navigation controller
                nc.getQueryParams({});
                nc.getQueryParams({}, '1');
                nc.getQueryParams({}, '2');

                const params = nc.getQueryParamsForHierarchy({
                    filter: defFilter,
                    sorting: defSorting,
                });
                expect(3).toEqual(params.length);
                expect(null).toEqual(params[0].filter.__root.valueOf());
                expect('1').toEqual(params[1].filter.__root.valueOf());
                expect('2').toEqual(params[2].filter.__root.valueOf());
            });
        });

        describe('updateQueryProperties', () => {
            it('Position', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                const metaRS = new RecordSet({
                    rawData: [
                        {
                            id: '1',
                            nav_result: true,
                        },
                        {
                            id: '2',
                            nav_result: false,
                        },
                    ],
                });

                rs.setMetaData({ more: metaRS });

                const params = nc.updateQueryProperties(rs);

                expect(params).toHaveLength(2);
                expect(params[0].field).toEqual(['id']);
                expect(params[1].field).toEqual(['id']);
            });

            it('Position, id type was changed in meta', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                let metaRS = new RecordSet({
                    rawData: [
                        {
                            id: '1',
                            nav_result: true,
                        },
                        {
                            id: '2',
                            nav_result: false,
                        },
                    ],
                });

                rs.setMetaData({ more: metaRS });
                expect(2).toEqual(nc.updateQueryProperties(rs).length);

                metaRS = new RecordSet({
                    rawData: [
                        {
                            id: 1,
                            nav_result: true,
                        },
                        {
                            id: '2',
                            nav_result: false,
                        },
                    ],
                });
                rs.setMetaData({ more: metaRS });
                expect(2).toEqual(nc.updateQueryProperties(rs).length);
            });
        });
    });
    describe('updateOptions', () => {
        it('new navigation type', () => {
            const nc = new NavigationController({
                navigationType: 'position',
                navigationConfig: {
                    field: 'id',
                    direction: 'bothways',
                },
            });

            const rs = new RecordSet({
                rawData: data,
                keyProperty: 'id',
            });

            // апдейтим параметры -> спрашиваем -> меняем конфиг -> спрашиваем параметры опять, должны быть сброшены
            nc.updateQueryProperties(rs);
            let params = nc.getQueryParams(
                { filter: {}, sorting: [] },
                null,
                {},
                'forward'
            );
            expect(6).toEqual(params.filter['id>=']);

            nc.updateOptions({
                navigationType: 'page',
                navigationConfig: {
                    pageSize: 2,
                },
            });

            params = nc.getQueryParams(
                { filter: {}, sorting: [] },
                null,
                {},
                'forward'
            );
            expect(params.filter['id>=']).toBeUndefined();
        });

        it('new navigation config', () => {
            const nc = new NavigationController({
                navigationType: 'position',
                navigationConfig: {
                    field: 'id',
                    direction: 'bothways',
                },
            });

            const rs = new RecordSet({
                rawData: data,
                keyProperty: 'id',
            });

            // апдейтим параметры -> спрашиваем -> меняем конфиг -> спрашиваем параметры опять, должны быть сброшены
            nc.updateQueryProperties(rs);
            let params = nc.getQueryParams(
                { filter: {}, sorting: [] },
                null,
                {},
                'forward'
            );
            expect(6).toEqual(params.filter['id>=']);

            nc.updateOptions({
                navigationType: 'position',
                navigationConfig: {
                    field: 'parId',
                    direction: 'forward',
                },
            });

            nc.updateQueryProperties(rs);
            params = nc.getQueryParams(
                { filter: {}, sorting: [] },
                null,
                {},
                'forward'
            );
            expect(9).toEqual(params.filter['parId>=']);
        });
    });

    describe('getQueryParams', () => {
        describe('page', () => {
            //
        });

        describe('position', () => {
            it('getQueryParams with config', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        field: 'id',
                        direction: 'forward',
                    },
                });

                const params = nc.getQueryParams(
                    { filter: {}, sorting: [] },
                    null,
                    {
                        direction: 'forward',
                        field: 'id',
                        limit: 15,
                        position: 0,
                    }
                );
                expect(0).toEqual(params.filter['id>=']);
            });
        });
    });

    describe('shiftToEdge', () => {
        describe('page', () => {
            it('shift to edge with more meta as boolean', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: false });
                nc.updateQueryProperties(rs);

                const edgeQueryConfig = nc.shiftToEdge(
                    'forward'
                ) as IBasePageSourceConfig;
                expect(edgeQueryConfig.page).toEqual(-1);
            });

            it('shift to edge with more meta as number', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: 18 });
                nc.updateQueryProperties(rs);

                const edgeQueryConfig = nc.shiftToEdge(
                    'forward'
                ) as IBasePageSourceConfig;
                expect(edgeQueryConfig.page).toEqual(5);
            });
            it('shift to edge with more meta as number. pageSize = 3, more = 19', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: false,
                    },
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id',
                });

                rs.setMetaData({ more: 19 });
                nc.updateQueryProperties(rs);

                const edgeQueryConfig = nc.shiftToEdge(
                    'forward'
                ) as IBasePageSourceConfig;
                expect(edgeQueryConfig.page).toEqual(1);
                expect(edgeQueryConfig.pageSize).toEqual(15);
            });
        });
    });
});
