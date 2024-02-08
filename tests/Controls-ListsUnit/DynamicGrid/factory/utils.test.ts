import { RecordSet } from 'Types/collection';
import {
    FactoryUtils,
    IDynamicColumnsFilter,
    IDynamicColumnsNavigation,
} from 'Controls-Lists/dynamicGrid';
import { adapter as EntityAdapter, format as EntityFormat } from 'Types/entity';
import { INavigationPositionSourceConfig } from 'Controls/interface';

describe('Controls-ListsUnit/DynamicGrid/factory/utils', () => {
    describe('applyLoadedColumnsData', () => {
        let columnsData;

        beforeEach(() => {
            columnsData = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    { key: 0, value: 'v-0' },
                    { key: 1, value: 'v-1' },
                    { key: 2, value: 'v-2' },
                    { key: 3, value: 'v-3' },
                    { key: 4, value: 'v-4' },
                    { key: 5, value: 'v-5' },
                    { key: 6, value: 'v-6' },
                    { key: 7, value: 'v-7' },
                    { key: 8, value: 'v-8' },
                    { key: 9, value: 'v-9' },
                ],
            });
        });

        afterEach(() => {
            columnsData = null;
        });

        test('moving forward', () => {
            const newColumnsData = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    { key: 10, value: 'v-10' },
                    { key: 11, value: 'v-11' },
                    { key: 12, value: 'v-12' },
                    { key: 13, value: 'v-13' },
                    { key: 14, value: 'v-14' },
                ],
            });
            const loadedDirection = 'forward';
            const startColumnDataKey = 5;
            const endColumnDataKey = 9;

            FactoryUtils.applyLoadedColumnsData(
                columnsData,
                newColumnsData,
                loadedDirection,
                startColumnDataKey,
                endColumnDataKey
            );

            expect(columnsData.getCount()).toEqual(10);
            for (let i = 0; i < columnsData.getCount(); i++) {
                expect(columnsData.at(i).getKey()).toEqual(i + 5);
            }
        });

        test('moving backward', () => {
            const newColumnsData = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    { key: -5, value: 'v--5' },
                    { key: -4, value: 'v--4' },
                    { key: -3, value: 'v--3' },
                    { key: -2, value: 'v--2' },
                    { key: -1, value: 'v--1' },
                ],
            });
            const loadedDirection = 'backward';
            const startColumnDataKey = 0;
            const endColumnDataKey = 4;

            FactoryUtils.applyLoadedColumnsData(
                columnsData,
                newColumnsData,
                loadedDirection,
                startColumnDataKey,
                endColumnDataKey
            );

            expect(columnsData.getCount()).toEqual(10);
            for (let i = 0; i < columnsData.getCount(); i++) {
                expect(columnsData.at(i).getKey()).toEqual(i - 5);
            }
        });
    });

    describe('applyLoadedItems', () => {
        const columnsDataProperty = 'dynamicColumnsData';
        let items;

        beforeEach(() => {
            items = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 777,
                        [columnsDataProperty]: new RecordSet({
                            keyProperty: 'key',
                            rawData: [
                                { key: 0, value: 'v-0' },
                                { key: 1, value: 'v-1' },
                                { key: 2, value: 'v-2' },
                                { key: 3, value: 'v-3' },
                                { key: 4, value: 'v-4' },
                                { key: 5, value: 'v-5' },
                                { key: 6, value: 'v-6' },
                                { key: 7, value: 'v-7' },
                                { key: 8, value: 'v-8' },
                                { key: 9, value: 'v-9' },
                            ],
                        }),
                    },
                ],
            });
        });

        afterEach(() => {
            items = null;
        });

        test('moving forward', () => {
            const loadedItems = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 777,
                        [columnsDataProperty]: new RecordSet({
                            keyProperty: 'key',
                            rawData: [
                                { key: 10, value: 'v-10' },
                                { key: 11, value: 'v-11' },
                                { key: 12, value: 'v-12' },
                                { key: 13, value: 'v-13' },
                                { key: 14, value: 'v-14' },
                            ],
                        }),
                    },
                ],
            });
            const direction = 'forward';
            const dynamicColumnsGridData = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

            FactoryUtils.applyLoadedItems({
                items,
                loadedItems,
                columnsDataProperty,
                dynamicColumnsGridData,
                direction,
            });

            expect(items.getCount()).toEqual(1);

            const columnsData = items.at(0).get(columnsDataProperty);
            expect(columnsData.getCount()).toEqual(10);

            for (let i = 0; i < columnsData.getCount(); i++) {
                expect(columnsData.at(i).getKey()).toEqual(i + 5);
            }
        });

        test('moving backward', () => {
            const loadedItems = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 777,
                        [columnsDataProperty]: new RecordSet({
                            keyProperty: 'key',
                            rawData: [
                                { key: -5, value: 'v--5' },
                                { key: -4, value: 'v--4' },
                                { key: -3, value: 'v--3' },
                                { key: -2, value: 'v--2' },
                                { key: -1, value: 'v--1' },
                            ],
                        }),
                    },
                ],
            });
            const direction = 'backward';
            const dynamicColumnsGridData = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];

            FactoryUtils.applyLoadedItems({
                items,
                loadedItems,
                columnsDataProperty,
                dynamicColumnsGridData,
                direction,
            });

            expect(items.getCount()).toEqual(1);

            const columnsData = items.at(0).get(columnsDataProperty);
            expect(columnsData.getCount()).toEqual(10);

            for (let i = 0; i < columnsData.getCount(); i++) {
                expect(columnsData.at(i).getKey()).toEqual(i - 5);
            }
        });
    });

    describe('prepareDynamicColumnsFilter', () => {
        const columnsDataProperty = 'dynamicColumnsData';
        const columnsNavigation: IDynamicColumnsNavigation = {
            sourceConfig: {
                field: columnsDataProperty,
                direction: 'bothways',
                position: 0,
                limit: 10,
            },
            source: 'position',
        };

        test('initial', () => {
            const actualPosition = undefined;
            const actualDirection = undefined;

            const expectedResult = {
                direction: 'bothways',
                limit: 10,
                position: 0,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter({
                columnsNavigation,
                actualPosition,
                actualDirection,
            });

            expect(columnsFilter).toEqual(expectedResult);
        });

        test('load forward', () => {
            const actualPosition = 5;
            const actualDirection = 'forward';

            const expectedResult = {
                direction: 'forward',
                limit: 10,
                position: 5,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter({
                columnsNavigation,
                actualPosition,
                actualDirection,
            });

            expect(columnsFilter).toEqual(expectedResult);
        });

        test('load backward', () => {
            const actualPosition = 6;
            const actualDirection = 'backward';

            const expectedResult = {
                direction: 'backward',
                limit: 10,
                position: 6,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter({
                columnsNavigation,
                actualPosition,
                actualDirection,
            });

            expect(columnsFilter).toEqual(expectedResult);
        });
    });

    describe('prepareDynamicColumnsFilterRecord', () => {
        test('prepare record', () => {
            const dynamicColumnsFilter: IDynamicColumnsFilter<number> = {
                direction: 'forward',
                limit: 10,
                position: 0,
            };
            const adapter = new EntityAdapter.Json();
            const positionFieldFormat = EntityFormat.IntegerField;

            const columnsFilterRecord = FactoryUtils.prepareDynamicColumnsFilterRecord(
                dynamicColumnsFilter,
                adapter,
                positionFieldFormat
            );

            expect(columnsFilterRecord.getRawData()).toEqual(dynamicColumnsFilter);

            expect(columnsFilterRecord.getAdapter()).toBeInstanceOf(EntityAdapter.Json);

            const columnsFilterRecordFormat = columnsFilterRecord.getFormat();
            expect(columnsFilterRecordFormat.at(0)).toBeInstanceOf(EntityFormat.IntegerField);
            expect(columnsFilterRecordFormat.at(1)).toBeInstanceOf(EntityFormat.IntegerField);
            expect(columnsFilterRecordFormat.at(2)).toBeInstanceOf(EntityFormat.StringField);
        });
    });

    describe('prepareLoadColumnsNavigation', () => {
        const verticalNavigationField = 'key';
        const items = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 0 },
                { key: 1 },
                { key: 2 },
                { key: 3 },
                { key: 4 },
                { key: 5 },
                { key: 6 },
                { key: 7 },
                { key: 8 },
                { key: 9 },
            ],
        });

        test('navigation "position"', () => {
            const verticalNavigationConfig: INavigationPositionSourceConfig = {
                field: verticalNavigationField,
                direction: 'forward',
                limit: 5,
                position: 0,
                multiNavigation: true,
            };

            const expectedResult = {
                field: verticalNavigationField,
                position: 0,
                limit: 10,
                direction: 'forward',
                multiNavigation: true,
            };

            const loadColumnsNavigation = FactoryUtils.prepareLoadColumnsNavigation(
                items,
                verticalNavigationConfig
            );

            expect(loadColumnsNavigation).toEqual(expectedResult);
        });

        test('navigation "page"', () => {
            const verticalNavigationConfig = {
                page: 0,
                pageSize: 5,
                direction: 'forward',
            };

            const expectedResult = {
                page: 0,
                pageSize: 10,
                direction: 'forward',
            };

            const loadColumnsNavigation = FactoryUtils.prepareLoadColumnsNavigation(
                items,
                verticalNavigationConfig
            );

            expect(loadColumnsNavigation).toEqual(expectedResult);
        });
    });
});
