import { GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_display:GridHeaderRow', () => {
    it('.getItemClasses()', () => {
        const headerRow = new GridHeaderRow({});
        expect(headerRow.getItemClasses({ theme: 'themeName' })).toEqual(
            'controls-Grid__header tw-contents tw-cursor-default'
        );
    });

    it('should add multiselect with rowspan if it is multi-line header', () => {
        const header = [{}];
        const headerRow = new GridHeaderRow({
            owner: getGridCollectionMock({
                gridColumnsConfig: [{}],
                headerConfig: header,
                hasMultiSelectColumn: true,
            }),
            columnsConfig: header,
            gridColumnsConfig: [{}],
            headerModel: {
                getBounds: () => {
                    return { row: { start: 1, end: 3 } };
                },
                isMultiline: (): boolean => {
                    return true;
                },
            },
        });
        expect(headerRow.getColumns().length).toEqual(2);
        expect(headerRow.getColumns()[0].getRowspanStyles()).toEqual('grid-row: 1 / 3;');
    });
});
