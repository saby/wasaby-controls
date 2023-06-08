import isFilterItemChanged from 'Controls/_filter/Utils/isFilterItemChanged';

describe('filterCalculator', () => {
    it('filterDescription with value equal resetValue', () => {
        const filterDescriptionItem = {
            name: 'test',
            value: [],
            resetValue: [],
        };
        expect(isFilterItemChanged(filterDescriptionItem)).toBe(false);
    });

    it('filterDescription with value', () => {
        const filterDescriptionItem = {
            name: 'test',
            value: ['test'],
            resetValue: [],
        };
        expect(isFilterItemChanged(filterDescriptionItem)).toBe(true);
    });
});
