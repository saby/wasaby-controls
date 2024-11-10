import { FilterCalculator } from 'Controls/filter';
import 'ControlsUnit/Filter/resources/descriptionToValueConverted';

describe('Controls/filter:FilterCalculator', () => {
    describe('getChangedFilters', () => {
        it('filters dont changed', () => {
            const currentFilter = {};
            const updatedFilter = {};
            expect(FilterCalculator.getChangedFilters(currentFilter, updatedFilter)).toEqual({});
        });

        it('filters are changed', () => {
            const currentFilter = { test: 'firstValue' };
            const updatedFilter = { test: 'secondValue' };
            expect(FilterCalculator.getChangedFilters(currentFilter, updatedFilter)).toEqual({
                test: 'secondValue',
            });
        });
    });

    describe('FilterCalculator.getFilterByFilterDescription', () => {
        it('filterDescription with value', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: [],
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual({
                test: [],
            });
        });

        it('filterDescription with empty value', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: undefined,
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual(
                {}
            );
        });

        it('filterDescription with value and visibility: false', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: [],
                    visibility: false,
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual(
                {}
            );
        });

        it('filterDescription with value and visibility: false', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: [],
                    visibility: false,
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual(
                {}
            );
        });
        it('filterDescription with descriptionToValueConverter', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: ['test'],
                    resetValue: [],
                },
                {
                    name: 'test1',
                    value: ['test1', 'test2'],
                    resetValue: [],
                    descriptionToValueConverter: ({ value }) => {
                        return {
                            test1FromProvider: value[0],
                            test2FromProvider: value[1],
                        };
                    },
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual({
                test: ['test'],
                test1FromProvider: 'test1',
                test2FromProvider: 'test2',
            });
        });

        it('filterDescription with descriptionToValueConverter as path to function', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: ['test'],
                    resetValue: [],
                },
                {
                    name: 'test1',
                    value: ['test1', 'test2'],
                    resetValue: [],
                    descriptionToValueConverter:
                        'ControlsUnit/Filter/resources/descriptionToValueConverted',
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual({
                test: ['test'],
                test1FromProvider: 'test1',
                test2FromProvider: 'test2',
            });
        });

        it('У сброшенного фильтра должен вызываться descriptionToValueConverter', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: null,
                    resetValue: null,
                    descriptionToValueConverter:
                        'ControlsUnit/Filter/resources/descriptionToValueConverted',
                    visibility: false,
                },
            ];
            expect(FilterCalculator.getFilterByFilterDescription({}, filterDescription)).toEqual({
                test1FromProvider: 'emptyValue1',
                test2FromProvider: 'emptyValue2',
            });
        });
    });
});
