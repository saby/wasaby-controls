import { GridGroupRow, GridGroupCell, GridItemActionsCell } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Group/ColumnScroll/GroupCell', () => {
    let getStickyColumnsCount: number;
    let hasColumnsScroll: boolean;

    const gridColumnsConfig = [{}, {}, {}, {}, {}];

    const getCollection = () => {
        return getGridCollectionMock({
            gridColumnsConfig,
            stickyColumnsCount: getStickyColumnsCount,
            hasColumnScroll: hasColumnsScroll,
            hasItemActionsSeparatedCell: true,
            hoverBackgroundStyle: 'default',
        });
    };

    beforeEach(() => {
        getStickyColumnsCount = 2;
        hasColumnsScroll = true;
    });

    it('split group on two parts for column scroll: fixed and scrollable', () => {
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig,
            colspanGroup: false,
        });

        expect(groupRow.getColumnsCount()).toEqual(3);

        expect(groupRow.getColumns()[0]).toBeInstanceOf(GridGroupCell);
        expect(groupRow.getColumns()[0].getColspan()).toEqual(2);

        expect(groupRow.getColumns()[1]).toBeInstanceOf(GridGroupCell);
        expect(groupRow.getColumns()[1].getColspan()).toEqual(3);

        expect(groupRow.getColumns()[2]).toBeInstanceOf(GridItemActionsCell);
    });

    // Если делим группу на колонки, то надо не только правильный colspan иметь, но и правильные grid-column
    it('has correct getColspanStyles for columns when no column', () => {
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig,
            colspanGroup: false,
        });

        const columns = groupRow.getColumns();

        expect(columns[0].getColspanStyles()).toEqual('grid-column: 1 / 3;');
        expect(columns[1].getColspanStyles()).toEqual('grid-column: 3 / 6;');
    });

    // Если никакого columnScroll нет, то и деления на колонки нет
    it('has correct getColspanStyles for columns', () => {
        getStickyColumnsCount = 0;
        hasColumnsScroll = false;
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig,
        });

        const columns = groupRow.getColumns();

        expect(columns[0].getColspanStyles()).toEqual('grid-column: 1 / 6;');
    });

    // Установка colspanGroup влияет на то, как строятся колонки
    it('setColspanGroup', () => {
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig,
            colspanGroup: true,
        });

        const columns = groupRow.getColumns();

        expect(columns[0].getColspanStyles()).toEqual('grid-column: 1 / 6;');
    });
});
