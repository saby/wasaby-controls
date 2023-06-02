import TreeGridFooterRow from 'Controls/_treeGrid/display/TreeGridFooterRow';
/**
 * TODO: регистрация Controls/treeGrid:TreeGridCollection находится именно в библиотеке,
 * и некоторые тесты этим пользуются
 */
import 'Controls/treeGrid';

const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' },
];
const mockedOwner = {
    getGridColumnsConfig: () => {
        return columns;
    },
    getStickyColumnsCount: () => {
        return 0;
    },
    hasMultiSelectColumn: () => {
        return false;
    },
    hasItemActionsSeparatedCell: () => {
        return true;
    },
    isFullGridSupport: () => {
        return true;
    },
    hasColumnScroll: () => {
        return false;
    },
    isStickyFooter: () => {
        return false;
    },
    hasSpacingColumn: () => {
        return false;
    },
    hasResizer: () => {
        return false;
    },
    hasColumnScrollReact: () => {
        return false;
    },
} as any;

describe('Controls/treeGrid_clean/Display/ExpanderPadding/TreeGridFooterRow', () => {
    it('setDisplayExpanderPadding', () => {
        const footerRow = new TreeGridFooterRow({
            displayExpanderPadding: false,
            gridColumnsConfig: columns,
            owner: mockedOwner,
            columnsConfig: [
                { startColumn: 1, endColumn: 3 },
                { startColumn: 3, endColumn: 4 },
                { startColumn: 4, endColumn: 7 },
            ],
        });

        expect(footerRow._$displayExpanderPadding).toBe(false);
        expect(footerRow.getColumns()[0]._$displayExpanderPadding).toBe(false);

        footerRow.setDisplayExpanderPadding(true);
        expect(footerRow._$displayExpanderPadding).toBe(true);
        expect(footerRow.getColumns()[0]._$displayExpanderPadding).toBe(true);
    });

    it('setDisplayExpanderPadding when not created columns', () => {
        const footerRow = new TreeGridFooterRow({
            displayExpanderPadding: false,
            gridColumnsConfig: columns,
            owner: mockedOwner,
            columnsConfig: [
                { startColumn: 1, endColumn: 3 },
                { startColumn: 3, endColumn: 4 },
                { startColumn: 4, endColumn: 7 },
            ],
        });

        expect(
            footerRow.setDisplayExpanderPadding.bind(footerRow, true)
        ).not.toThrow();
    });
});
