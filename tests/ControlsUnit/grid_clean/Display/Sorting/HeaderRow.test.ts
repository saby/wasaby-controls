import { GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Sorting/HeaderRow', () => {
    it('set sorting on creating', () => {
        const columns = [{}, {}, {}];
        const header = [{ sortingProperty: 'test' }, {}, {}];
        const mockedHeaderModel = {
            isMultiline: () => {
                return false;
            },
            isSticked: () => {
                return false;
            },
        };
        const sorting = [{ test: 'ASC' }];
        const headerRow = new GridHeaderRow({
            sorting,
            columnsConfig: header,
            headerModel: mockedHeaderModel,
            gridColumnsConfig: columns,
            owner: getGridCollectionMock({
                gridColumnsConfig: columns,
                headerConfig: header,
                leftPadding: 's',
                rightPadding: 's',
            }),
        });
        expect(headerRow.getColumns()[0].getSorting()).toEqual('ASC');
    });
});
