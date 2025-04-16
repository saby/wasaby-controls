import { DataSet } from 'Controls/dataSource';
import {
    getMemory,
    getHierarchicalMemory,
    items,
} from 'ControlsUnit/dataFactory/DataSet/resources/sources';
import { Memory, PrefetchProxy } from 'Types/source';

describe('Controls/dataFactory:DataSet', () => {
    describe('load', () => {
        it('Метод load вернул RecordSet из источника', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
            });

            const result = await dataSet.load();
            expect(result.getCount()).toEqual(4);
        });

        it('Метод load вернул RecordSet из источника по навигации из конструктора', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            const result = await dataSet.load();
            expect(result.getCount()).toEqual(1);
            expect(result.at(0).getKey()).toEqual(0);
        });

        it('Метод load вернул RecordSet по переданной навигации в метод', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            const result = await dataSet.load({ pageSize: 1, page: 2 });
            expect(result.getCount()).toEqual(1);
            expect(result.at(0).getKey()).toEqual(2);
        });

        it('Метод load вернул RecordSet по переданной множественной навигации в метод', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            const result = await dataSet.load({ pageSize: 1, page: 2 });
            expect(result.getCount()).toEqual(1);
            expect(result.at(0).getKey()).toEqual(2);
        });

        it('Метод load вернул RecordSet c корневыми записями из источника', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
            });

            const result = await dataSet.load();
            expect(result.getCount()).toEqual(3);
        });

        it('Перезагрузка с сохранением навигации', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            await dataSet.load();
            await dataSet.next();

            const result = await dataSet.load(true);
            expect(result.getCount()).toBe(2);
        });
    });

    describe('prev', () => {
        it('Вызов метода prev должен вернуть предыдущую пачку данных', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 1,
                        hasMore: false,
                    },
                },
            });
            await dataSet.load();
            const result = await dataSet.prev();
            expect(result.at(0).getKey()).toEqual(0);
        });
    });

    describe('next', () => {
        it('Вызов метода next должен вернуть следующую пачку данных', async () => {
            const dataSet = new DataSet({
                source: getMemory(),
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });
            await dataSet.load();
            const result = await dataSet.next();
            expect(result.at(0).getKey()).toEqual(1);
        });

        it('Вызов метода next для папки должен вернуть следующую пачку данных', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            await dataSet.load();
            await dataSet.expand(0);
            expect(dataSet.hasMoreData('forward', 0)).toBeTruthy();

            await dataSet.next(0);
            expect(dataSet.hasMoreData('forward', 0)).toBeFalsy();
        });
    });

    describe('changeRoot', () => {
        it('Вызов changeRoot загружает данные для переданного корня', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
            });

            const result = await dataSet.changeRoot(0);
            expect(result.getCount()).toEqual(2);
        });

        it('Навигация обновляется при смене корня', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            await dataSet.changeRoot(0);
            expect(dataSet.hasMoreData('forward')).toBeTruthy();

            await dataSet.changeRoot(3);
            expect(dataSet.hasMoreData('forward')).toBeFalsy();
        });
    });

    describe('expand', () => {
        it('Вызов expand загружает данные для переданного узла', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
            });

            await dataSet.load();
            const result = await dataSet.expand(0);
            expect(result.getCount()).toEqual(2);
        });

        it('Навигация обновляется при раскрытии узла', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            await dataSet.load();
            await dataSet.expand(0);
            expect(dataSet.hasLoaded(0)).toBeTruthy();
            expect(dataSet.hasMoreData('forward', 0)).toBeTruthy();

            await dataSet.expand(3);
            expect(dataSet.hasLoaded(3)).toBeTruthy();
            expect(dataSet.hasMoreData('forward', 3)).toBeFalsy();
            expect(dataSet.hasLoaded(0)).toBeTruthy();
        });
    });

    describe('sourceType/sourceOptions', () => {
        it('Вызов load загружает данные из источника, заданного в sourceType', async () => {
            const dataSet = new DataSet({
                sourceType: 'Types/source:Memory',
                sourceOptions: {
                    keyProperty: 'key',
                    data: items,
                },
            });

            const result = await dataSet.load();
            expect(result.getCount()).toEqual(4);
        });
    });

    describe('getKeyProperty', () => {
        it('keyProperty from source', () => {
            const options = {
                source: new Memory({
                    keyProperty: 'testKeyProperty',
                }),
            };
            const dataSet = new DataSet(options);
            expect(dataSet.getKeyProperty()).toEqual('testKeyProperty');
        });

        it('keyProperty in options', () => {
            const options = {
                source: new Memory(),
                keyProperty: 'testKeyProperty',
            };
            const dataSet = new DataSet(options);
            expect(dataSet.getKeyProperty()).toEqual('testKeyProperty');
        });

        it('keyProperty from PrefetchProxy source', () => {
            const source = new Memory({
                keyProperty: 'testKeyProperty',
            });
            const options = {
                source: new PrefetchProxy({
                    target: source,
                }),
            };
            const dataSet = new DataSet(options);
            expect(dataSet.getKeyProperty()).toEqual('testKeyProperty');
        });
    });

    describe('resetPagination', () => {
        it('keyProperty from source', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
                pagination: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 1,
                        page: 0,
                        hasMore: false,
                    },
                },
            });

            await dataSet.load();
            await dataSet.expand(0);

            await dataSet.resetPagination(0);
            expect(dataSet.hasLoaded(0)).toBeFalsy();
        });
    });
});
