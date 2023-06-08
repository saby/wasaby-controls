import { GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Ladder/HeaderRow/initializeColumns', () => {
    describe('hide shadow for sticky ladder in correct places', () => {
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

        it('single sticky property', () => {
            columns = [{ stickyProperty: ['first'] }, {}, {}];
            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getOwner(),
            });
            expect(headerRow.getColumns()[0].shadowVisibility).toEqual(
                'hidden'
            );
        });
        it('two sticky properties', () => {
            columns = [{ stickyProperty: ['first', 'second'] }, {}, {}];
            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getOwner(),
            });
            expect(headerRow.getColumns()[0].shadowVisibility).toEqual(
                'hidden'
            );
            expect(headerRow.getColumns()[2].shadowVisibility).toEqual(
                'hidden'
            );
        });
    });
});
