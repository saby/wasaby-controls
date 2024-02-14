import { FactoryUtils, IRange, Quantum, ITimelineColumnsFilter } from 'Controls-Lists/timelineGrid';
import { adapter as EntityAdapter, format as EntityFormat } from 'Types/entity';

describe('Controls-ListsUnit/TimelineGrid/factory/utils', () => {
    describe('prepareDynamicColumnsFilter', () => {
        test('initial', () => {
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 21, 0, 0, 0, 0),
            };
            const direction = 'bothways';
            const startPositionToForwards = new Date(2023, 5, 21, 0, 0, 0, 0);
            const startPositionToBackward = new Date(2023, 5, 15, 0, 0, 0, 0);

            const expectedResult = {
                direction: 'forward',
                limit: 7,
                position: new Date(2023, 5, 15, 0, 0, 0, 0),
                quantum: Quantum.Day,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter(
                range,
                direction,
                startPositionToForwards,
                startPositionToBackward
            );

            expect(columnsFilter).toEqual(expectedResult);
        });

        test('load forward', () => {
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 21, 0, 0, 0, 0),
            };
            const direction = 'forward';
            const startPositionToForwards = new Date(2023, 5, 21, 0, 0, 0, 0);
            const startPositionToBackward = new Date(2023, 5, 15, 0, 0, 0, 0);

            const expectedResult = {
                direction: 'forward',
                limit: 7,
                position: new Date(2023, 5, 22, 0, 0, 0, 0),
                quantum: Quantum.Day,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter(
                range,
                direction,
                startPositionToForwards,
                startPositionToBackward
            );

            expect(columnsFilter).toEqual(expectedResult);
        });

        test('load backward', () => {
            const range: IRange = {
                start: new Date(2023, 5, 15, 0, 0, 0, 0),
                end: new Date(2023, 5, 21, 0, 0, 0, 0),
            };
            const direction = 'backward';
            const startPositionToForwards = new Date(2023, 5, 21, 0, 0, 0, 0);
            const startPositionToBackward = new Date(2023, 5, 15, 0, 0, 0, 0);

            const expectedResult = {
                direction: 'backward',
                limit: 7,
                position: new Date(2023, 5, 14, 0, 0, 0, 0),
                quantum: Quantum.Day,
            };

            const columnsFilter = FactoryUtils.prepareDynamicColumnsFilter(
                range,
                direction,
                startPositionToForwards,
                startPositionToBackward
            );

            expect(columnsFilter).toEqual(expectedResult);
        });
    });

    describe('prepareDynamicColumnsFilterRecord', () => {
        test('prepare record', () => {
            const dynamicColumnsFilter: ITimelineColumnsFilter = {
                position: new Date(2023, 5, 15, 0, 0, 0, 0),
                limit: 7,
                direction: 'forward',
                quantum: Quantum.Day,
            };
            const adapter = new EntityAdapter.Json();
            const positionFieldFormat = EntityFormat.DateTimeField;

            const columnsFilterRecord = FactoryUtils.prepareDynamicColumnsFilterRecord(
                dynamicColumnsFilter,
                adapter,
                positionFieldFormat
            );

            const expectedResult = {
                position: '2023-06-15 00:00:00+03',
                limit: dynamicColumnsFilter.limit,
                direction: dynamicColumnsFilter.direction,
                quantum: dynamicColumnsFilter.quantum,
            };

            expect(columnsFilterRecord.getRawData()).toEqual(expectedResult);

            expect(columnsFilterRecord.getAdapter()).toBeInstanceOf(EntityAdapter.Json);

            const columnsFilterRecordFormat = columnsFilterRecord.getFormat();
            expect(columnsFilterRecordFormat.at(0)).toBeInstanceOf(EntityFormat.StringField);
            expect(columnsFilterRecordFormat.at(1)).toBeInstanceOf(EntityFormat.IntegerField);
            expect(columnsFilterRecordFormat.at(2)).toBeInstanceOf(EntityFormat.DateTimeField);
            expect(columnsFilterRecordFormat.at(3)).toBeInstanceOf(EntityFormat.StringField);
        });
    });
});
