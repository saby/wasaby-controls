import DataSet from 'Controls/DataSet';
import {
    getMemory,
    getHierarchicalMemory,
    items,
} from 'ControlsUnit/dataFactory/DataSet/resources/sources';

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

        it('Метод load вернул RecordSet c корневыми записями из источника', async () => {
            const dataSet = new DataSet({
                source: getHierarchicalMemory(),
                parentProperty: 'parent',
            });

            const result = await dataSet.load();
            expect(result.getCount()).toEqual(3);
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
});
