import { GridFooterRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' },
];
const mockedOwner = getGridCollectionMock({
    gridColumnsConfig: columns,
});

describe('Controls/grid_clean/Display/Footer/FooterRow/UpdateOption', () => {
    const firstFooterTemplate = () => {
        return 'FirstFooter';
    };
    const secondFooterTemplate = () => {
        return 'SecondFooter';
    };
    const firstFooterCellTemplate = () => {
        return 'FirstFooterCell';
    };
    const secondFooterCellTemplate = () => {
        return 'SecondFooterCell';
    };

    it('Initialize with footerTemplate', () => {
        const footerRow = new GridFooterRow({
            owner: mockedOwner,
            rowTemplate: firstFooterTemplate,
        });

        expect(footerRow.getVersion()).toBe(0);
        const footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(1);
        expect(footerColumns[0].getTemplate()).toBe(firstFooterTemplate);
    });

    it('Initialize with footer', () => {
        const footerRow = new GridFooterRow({
            owner: mockedOwner,
            columnsConfig: [
                { template: firstFooterCellTemplate },
                { template: secondFooterCellTemplate },
            ],
            gridColumnsConfig: columns,
        });

        expect(footerRow.getVersion()).toBe(0);
        const footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(2);
        expect(footerColumns[0].getTemplate()).toBe(firstFooterCellTemplate);
        expect(footerColumns[1].getTemplate()).toBe(secondFooterCellTemplate);
    });

    it('Initialize with footerTemplate and footer', () => {
        const footerRow = new GridFooterRow({
            owner: mockedOwner,
            rowTemplate: firstFooterTemplate,
            columnsConfig: [
                { template: firstFooterCellTemplate },
                { template: secondFooterCellTemplate },
            ],
            gridColumnsConfig: columns,
        });

        expect(footerRow.getVersion()).toBe(0);
        const footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(1);
        expect(footerColumns[0].getTemplate()).toBe(firstFooterTemplate);
    });

    it('Initialize with footerTemplate and setFooter', () => {
        const footerRow = new GridFooterRow({
            owner: mockedOwner,
            rowTemplate: firstFooterTemplate,
            gridColumnsConfig: columns,
        });

        let footerColumns = footerRow.getColumns();

        // set new "footerTemplate"
        footerRow.setFooter(secondFooterTemplate);
        expect(footerRow.getVersion()).toBe(1);
        footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(1);
        expect(footerColumns[0].getTemplate()).toBe(secondFooterTemplate);

        // set new "footerTemplate" and "footer"
        const newColumns = [
            { template: firstFooterCellTemplate },
            { template: secondFooterCellTemplate },
        ];
        footerRow.setFooter(firstFooterTemplate, newColumns);
        expect(footerRow.getVersion()).toBe(3);
        footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(1);
        expect(footerColumns[0].getTemplate()).toBe(firstFooterTemplate);

        // clear "footerTemplate"
        footerRow.setFooter(undefined, newColumns);
        expect(footerRow.getVersion()).toBe(4);
        footerColumns = footerRow.getColumns();
        expect(footerColumns.length).toBe(2);
        expect(footerColumns[0].getTemplate()).toBe(firstFooterCellTemplate);
        expect(footerColumns[1].getTemplate()).toBe(secondFooterCellTemplate);
    });

    it('Initialize with footerTemplate and setColumnsConfig. Check colspan.', () => {
        const nextColumns = [
            { displayProperty: 'col1' },
            { displayProperty: 'col2' },
        ];

        const localMockedOwner = getGridCollectionMock({
            gridColumnsConfig: columns,
        });

        const footerRow = new GridFooterRow({
            owner: localMockedOwner,
            rowTemplate: firstFooterTemplate,
            gridColumnsConfig: columns,
        });

        let footerColumns = footerRow.getColumns();
        expect(footerColumns[0].getColspan()).toBe(3);

        localMockedOwner.getGridColumnsConfig = () => {
            return nextColumns;
        };
        localMockedOwner.getColumnsEnumerator = () => {
            return {
                getColumnsConfig: () => {
                    return nextColumns;
                },
            };
        };
        footerRow.setColumnsConfig(nextColumns);
        footerRow.setColumnsEnumerator({
            getColumnsConfig: () => {
                return nextColumns;
            },
        });

        footerColumns = footerRow.getColumns();
        expect(footerColumns[0].getColspan()).toBe(2);
    });
});
