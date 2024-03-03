import { GridFooterRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/FooterRow', () => {
    it('should not skip columns for colspan. All 3 colspaned columns in footer should be shown.', () => {
        const gridColumnsConfig = [{}, {}, {}, {}, {}];
        const mockedCollection = getGridCollectionMock({
            gridColumnsConfig,
        });

        const footerColumnsConfig = [
            { startColumn: 1, endColumn: 3 },
            { startColumn: 3, endColumn: 5 },
            { startColumn: 5, endColumn: 6 },
        ];
        const footerRow = new GridFooterRow({
            owner: mockedCollection,
            columnsConfig: footerColumnsConfig,
            gridColumnsConfig,
        });

        expect(footerRow.getColumns().length).toEqual(3);
        expect(footerRow.getColumns()[0].getColumnConfig()).toEqual(footerColumnsConfig[0]);
        expect(footerRow.getColumns()[1].getColumnConfig()).toEqual(footerColumnsConfig[1]);
        expect(footerRow.getColumns()[2].getColumnConfig()).toEqual(footerColumnsConfig[2]);

        footerRow.setColumnsConfig([{ startColumn: 1, endColumn: 6 }]);
        expect(footerRow.getColumns().length).toEqual(1);
    });
});
