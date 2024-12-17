import { GridTableHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/MultiHeader/TableHeaderRow/hasMultiselectColumn', () => {
    const columns = [{}, {}, {}];
    const header = [{}, {}, {}];
    let rowIndex = 0;
    let hasMultiSelectColumn = true;

    const getOwner = () => {
        return getGridCollectionMock({
            gridColumnsConfig: columns,
            headerConfig: header,
            hasMultiSelectColumn,
            leftPadding: 's',
            rightPadding: 's',
        });
    };

    const mockedHeaderModel = {
        isMultiline: () => {
            return true;
        },
        isSticked: () => {
            return false;
        },
        getRowIndex: () => {
            return rowIndex;
        },
    };

    it('first row, owner has multiselect column', () => {
        rowIndex = 0;
        hasMultiSelectColumn = true;

        const headerRow = new GridTableHeaderRow({
            header,
            headerModel: mockedHeaderModel,
            columns,
            owner: getOwner(),
        });
        expect(headerRow.hasMultiSelectColumn()).toBe(true);
    });

    it('first row, owner has no multiselect column', () => {
        rowIndex = 0;
        hasMultiSelectColumn = false;

        const headerRow = new GridTableHeaderRow({
            header,
            headerModel: mockedHeaderModel,
            columns,
            owner: getOwner(),
        });
        expect(headerRow.hasMultiSelectColumn()).toBe(false);
    });

    it('second row, owner has no multiselect column', () => {
        rowIndex = 1;
        hasMultiSelectColumn = false;

        const headerRow = new GridTableHeaderRow({
            header,
            headerModel: mockedHeaderModel,
            columns,
            owner: getOwner(),
        });
        expect(headerRow.hasMultiSelectColumn()).toBe(false);
    });

    it('first row, owner has multiselect column', () => {
        rowIndex = 1;
        hasMultiSelectColumn = true;

        const headerRow = new GridTableHeaderRow({
            header,
            headerModel: mockedHeaderModel,
            columns,
            owner: getOwner(),
        });
        expect(headerRow.hasMultiSelectColumn()).toBe(false);
    });
});
