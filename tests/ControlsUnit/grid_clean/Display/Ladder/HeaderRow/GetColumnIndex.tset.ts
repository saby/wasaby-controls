import { GridHeaderRow, GridHeaderCell } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Ladder/HeaderRow/GetColumnIndex', () => {
    let columns = [{}, {}, {}];
    const header = [{}, {}, {}];

    const getOwner = () => {
        return getGridCollectionMock({
            gridColumnsConfig: columns,
            headerConfig: header,
            leftPadding: 's',
            rightPadding: 's',
        });
    };

    const mockedHeaderModel = {
        isMultiline: () => {
            return false;
        },
        isSticked: () => {
            return false;
        },
    };

    it('first not-ladder cell must have index 0', () => {
        columns = [{ stickyProperty: ['first'] }, {}, {}];
        const headerRow = new GridHeaderRow({
            header,
            headerModel: mockedHeaderModel,
            columns,
            owner: getOwner(),
        });
        const firstHeaderCell = headerRow.getColumns()[1] as GridHeaderCell;
        expect(headerRow.getColumnIndex(firstHeaderCell)).toEqual(0);
    });
});
