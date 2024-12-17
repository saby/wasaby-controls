import { RecordSet } from 'Types/collection';
import {
    FactoryDynamicColumnsGridDataGenerator,
    IDynamicColumnsFilter,
} from 'Controls-Lists/dynamicGrid';

describe('Controls-ListsUnit/DynamicGrid/factory/DynamicColumnsGridDataGenerator', () => {
    describe('generateDynamicColumnsData', () => {
        test('{ position: 10, direction: "forward" }', () => {
            const expectedResult = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            const filter: IDynamicColumnsFilter = { limit: 10, position: 10, direction: 'forward' };

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsData(filter);
            expect(columnsData).toEqual(expectedResult);
        });

        test('{ position: 20, direction: "backward" }', () => {
            const expectedResult = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
            const filter: IDynamicColumnsFilter = {
                limit: 10,
                position: 20,
                direction: 'backward',
            };

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsData(filter);
            expect(columnsData).toEqual(expectedResult);
        });

        test('{ position: 30, direction: "bothways" }', () => {
            const expectedResult = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
            const filter: IDynamicColumnsFilter = {
                limit: 10,
                position: 30,
                direction: 'bothways',
            };

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsData(filter);
            expect(columnsData).toEqual(expectedResult);
        });
    });

    describe('generateDynamicColumnsDataByItems', () => {
        test('empty RecordSet', () => {
            const expectedResult = [];
            const dynamicColumnsDataProperty = 'dynamicColumnsData';
            const items = new RecordSet({
                keyProperty: 'key',
                rawData: [],
            });

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsDataByItems(
                    items,
                    dynamicColumnsDataProperty
                );
            expect(columnsData).toEqual(expectedResult);
        });

        test('empty DynamicColumnsData', () => {
            const expectedResult = [];
            const dynamicColumnsDataProperty = 'dynamicColumnsData';
            const items = new RecordSet({
                keyProperty: 'key',
                rawData: [{ key: 0 }],
            });

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsDataByItems(
                    items,
                    dynamicColumnsDataProperty
                );
            expect(columnsData).toEqual(expectedResult);
        });

        test('numbers', () => {
            const expectedResult = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            const dynamicColumnsDataProperty = 'dynamicColumnsData';
            const items = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 0,
                        [dynamicColumnsDataProperty]: new RecordSet({
                            keyProperty: 'data_key',
                            rawData: [
                                { data_key: 0, value: 'v-0' },
                                { data_key: 1, value: 'v-1' },
                                { data_key: 2, value: 'v-2' },
                                { data_key: 3, value: 'v-3' },
                                { data_key: 4, value: 'v-4' },
                                { data_key: 5, value: 'v-5' },
                                { data_key: 6, value: 'v-6' },
                                { data_key: 7, value: 'v-7' },
                                { data_key: 8, value: 'v-8' },
                                { data_key: 9, value: 'v-9' },
                            ],
                        }),
                    },
                ],
            });

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsDataByItems(
                    items,
                    dynamicColumnsDataProperty
                );
            expect(columnsData).toEqual(expectedResult);
        });

        test('alphabet', () => {
            const expectedResult = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            const dynamicColumnsDataProperty = 'dynamicColumnsData';
            const items = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 0,
                        [dynamicColumnsDataProperty]: new RecordSet({
                            keyProperty: 'data_key',
                            rawData: [
                                { data_key: 'a', value: 'v-a' },
                                { data_key: 'b', value: 'v-b' },
                                { data_key: 'c', value: 'v-c' },
                                { data_key: 'd', value: 'v-d' },
                                { data_key: 'e', value: 'v-e' },
                                { data_key: 'f', value: 'v-f' },
                                { data_key: 'g', value: 'v-g' },
                                { data_key: 'h', value: 'v-h' },
                                { data_key: 'i', value: 'v-i' },
                                { data_key: 'j', value: 'v-j' },
                            ],
                        }),
                    },
                ],
            });

            const columnsData =
                FactoryDynamicColumnsGridDataGenerator.generateDynamicColumnsDataByItems(
                    items,
                    dynamicColumnsDataProperty
                );
            expect(columnsData).toEqual(expectedResult);
        });
    });
});
