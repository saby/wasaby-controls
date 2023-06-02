import getFilterByFilterDescription from 'Controls/_filter/filterCalculator';
import 'ControlsUnit/Filter/resources/descriptionToValueConverted';

describe('filterCalculator', () => {
    it('filterDescription with value', () => {
        const filterDescription = [
            {
                name: 'test',
                value: [],
            },
        ];
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({
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
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({});
    });

    it('filterDescription with value and visibility: false', () => {
        const filterDescription = [
            {
                name: 'test',
                value: [],
                visibility: false,
            },
        ];
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({});
    });

    it('filterDescription with value and visibility: false', () => {
        const filterDescription = [
            {
                name: 'test',
                value: [],
                visibility: false,
            },
        ];
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({});
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
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({
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
        expect(getFilterByFilterDescription({}, filterDescription)).toEqual({
            test: ['test'],
            test1FromProvider: 'test1',
            test2FromProvider: 'test2',
        });
    });
});
