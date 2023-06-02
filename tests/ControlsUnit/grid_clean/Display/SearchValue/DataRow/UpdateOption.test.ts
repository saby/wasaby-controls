import { Model } from 'Types/entity';
import { GridDataRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const TEST_SEARCH_VALUE = 'test';
const rawData = { key: 1, col1: 'c1-1', col2: 'с2-1', col3: 'с3-1' };
const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' },
];

describe('Controls/grid_clean/Display/SearchValue/DataRow/UpdateOption', () => {
    let model: Model;

    beforeEach(() => {
        model = new Model({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        model = undefined;
    });

    const getOwner = (hasMultiSelectColumn?: boolean) => {
        return getGridCollectionMock({
            gridColumnsConfig: columns,
            hasMultiSelectColumn,
        });
    };

    it('Initialize without searchValue and set searchValue', () => {
        const gridDataRow = new GridDataRow({
            contents: model,
            owner: {} as any,
            columnsConfig: columns,
            gridColumnsConfig: columns,
        });

        expect(Object.keys(gridDataRow.getSearchValue())).toHaveLength(0);
        expect(gridDataRow.getVersion()).toBe(0);

        gridDataRow.setSearchValue(TEST_SEARCH_VALUE);

        expect(gridDataRow.getSearchValue()).toBe(TEST_SEARCH_VALUE);
        expect(gridDataRow.getVersion()).toBe(1);
    });

    it('Initialize without searchValue and set searchValue - check setSearchValue for columns', () => {
        const gridDataRow = new GridDataRow({
            contents: model,
            owner: getOwner(),
            columnsConfig: columns,
            gridColumnsConfig: columns,
        });

        const columnItems = gridDataRow.getColumns();
        columnItems.forEach((column) => {
            jest.spyOn(column, 'setSearchValue').mockClear();
        });

        gridDataRow.setSearchValue(TEST_SEARCH_VALUE);

        gridDataRow.getColumns().forEach((column) => {
            expect(column.setSearchValue).toHaveBeenCalledTimes(1);
            expect(column.setSearchValue.mock.calls[0][0]).toBe(
                TEST_SEARCH_VALUE
            );
        });

        jest.restoreAllMocks();
    });

    it('Initialize with multiSelectVisibility="visible", without searchValue and set searchValue', () => {
        const gridDataRow = new GridDataRow({
            contents: model,
            multiSelectVisibility: 'visible',
            owner: getOwner(true),
            columnsConfig: columns,
            gridColumnsConfig: columns,
        });

        const columnItems = gridDataRow.getColumns();
        columnItems.forEach((column) => {
            if (column.hasOwnProperty('setSearchValue')) {
                jest.spyOn(column, 'setSearchValue').mockClear();
            }
        });

        gridDataRow.setSearchValue(TEST_SEARCH_VALUE);

        gridDataRow.getColumns().forEach((column) => {
            if (column.hasOwnProperty('setSearchValue')) {
                expect(column.setSearchValue).toHaveBeenCalledTimes(1);
                expect(column.setSearchValue.mock.calls[0][0]).toBe(
                    TEST_SEARCH_VALUE
                );
            }
        });

        jest.restoreAllMocks();
    });
});
