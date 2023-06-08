import { RecordSet } from 'Types/collection';
import { GridCollection, GridDataRow } from 'Controls/grid';

const TEST_SEARCH_VALUE = 'test';
const rawData = [
    { key: 1, col1: 'c1-1', col2: 'с2-1', col3: 'с3-1' },
    { key: 2, col1: 'c1-2', col2: 'с2-2', col3: 'с3-2' },
    { key: 3, col1: 'c1-3', col2: 'с2-3', col3: 'с3-3' },
    { key: 4, col1: 'c1-4', col2: 'с2-4', col3: 'с3-4' },
];
const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' },
];

describe('Controls/grid_clean/Display/SearchValue/UpdateOption', () => {
    let collection: RecordSet;

    beforeEach(() => {
        collection = new RecordSet({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        collection = undefined;
    });

    it('Initialize without searchValue and set searchValue', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
        });

        expect(Object.keys(gridCollection.getSearchValue())).toHaveLength(0);
        expect(gridCollection.getVersion()).toBe(0);

        gridCollection.getViewIterator().each((item: GridDataRow<any>) => {
            jest.spyOn(item, 'setSearchValue').mockClear();
        });

        gridCollection.setSearchValue(TEST_SEARCH_VALUE);

        expect(gridCollection.getSearchValue()).toBe(TEST_SEARCH_VALUE);
        expect(gridCollection.getVersion()).toBe(1);
        gridCollection.getViewIterator().each((item: GridDataRow<any>) => {
            expect(item.setSearchValue).toHaveBeenCalledTimes(1);
            expect(item.setSearchValue.mock.calls[0][0]).toBe(
                TEST_SEARCH_VALUE
            );
        });

        jest.restoreAllMocks();
    });
});
