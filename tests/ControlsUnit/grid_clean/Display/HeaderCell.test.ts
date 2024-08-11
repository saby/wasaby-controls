import { GridHeaderCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from 'ControlsUnit/CustomAsserts';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/HeaderCell', () => {
    describe('Controls/grid_clean/Display/HeaderCell/getColspanStyles', () => {
        it('checkbox cell', () => {
            const cell = new GridHeaderCell({
                column: {},
                owner: getHeaderRowMock({
                    gridColumnsConfig: [{}, {}],
                    headerColumnsConfig: [{}, {}],
                    hasMultiSelectColumn: true,
                    isMultiline: true,
                }),
                isCheckBoxCell: true,
            });
            expect(cell.getColspanStyles()).toEqual('grid-column: 1 / 2;');
        });
    });

    describe('Controls/grid_clean/Display/HeaderCell/getWrapperClasses', () => {
        let hasColumnScroll;
        let columnScrollViewMode;

        const headerConfig = [{}, {}];
        const columnsConfig = [{}, {}];
        const getCell = () => {
            return new GridHeaderCell({
                column: headerConfig[1],
                owner: getHeaderRowMock({
                    gridColumnsConfig: columnsConfig,
                    headerColumnsConfig: headerConfig,
                    hasColumnScroll,
                    columnIndex: 1,
                    columnItems: [
                        {
                            isLadderCell: () => {
                                return false;
                            },
                        },
                        {
                            isLadderCell: () => {
                                return false;
                            },
                        },
                    ],
                    columnScrollViewMode,
                }),
            });
        };

        it('without column scroll', () => {
            hasColumnScroll = false;
            cAssert.include(getCell().getWrapperClasses(), 'controls-Grid__header-cell_min-width');
        });

        it('with column scroll', () => {
            hasColumnScroll = true;
            cAssert.notInclude(
                getCell().getWrapperClasses(),
                'controls-Grid__header-cell_min-width'
            );
        });

        it('with column scroll and arrows scroll mode', () => {
            hasColumnScroll = true;
            columnScrollViewMode = 'arrows';
            cAssert.include(
                getCell().getWrapperClasses(),
                'controls-Grid__header-cell_withColumnScrollArrows'
            );
        });
    });
});
