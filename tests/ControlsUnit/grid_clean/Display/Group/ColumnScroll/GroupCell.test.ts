import {GridGroupRow, GridGroupCell, GridItemActionsCell, GridCollection} from 'Controls/grid';
import {assert} from 'chai';
import {CssClassesAssert} from 'ControlsUnit/CustomAsserts';

describe('Controls/grid_clean/Display/Group/ColumnScroll/GroupCell', () => {
    let getStickyColumnsCount: number;
    let hasColumnsScroll: boolean;

    const gridColumnsConfig = [{}, {}, {}, {}, {}];

    const mockedCollection: GridCollection<any> = {
        getGridColumnsConfig: () => gridColumnsConfig,
        getStickyColumnsCount: () => getStickyColumnsCount,
        isFullGridSupport: () => true,
        hasMultiSelectColumn: () => false,
        hasColumnScroll: () => hasColumnsScroll,
        hasItemActionsSeparatedCell: () => true,
        isStickyHeader: () => false,
        hasHeader: () => false,
        getResultsPosition: () => undefined,
        getHoverBackgroundStyle: () => 'default',
        isDragged: () => false,
        getTopPadding: () => 'default',
        getBottomPadding: () => 'default',
        getLeftPadding: () => 'default',
        getRightPadding: () => 'default',
        getEditingConfig: () => ({}),
        getColumnIndex: () => 0,
        getColumnsCount: () => 0,
        getMultiSelectVisibility: () => 'hidden',
        isAnimatedForSelection: () => false
    } as undefined as GridCollection<any>;

    beforeEach(() => {
        getStickyColumnsCount = 2;
        hasColumnsScroll = true;
    });

    it('split group on two parts for column scroll: fixed and scrollable', () => {
        const groupRow = new GridGroupRow({
            owner: mockedCollection,
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig: gridColumnsConfig,
            colspanGroup: false
        });

        assert.equal(groupRow.getColumnsCount(), 3);

        assert.instanceOf(groupRow.getColumns()[0], GridGroupCell);
        assert.equal(groupRow.getColumns()[0].getColspan(), 2);

        assert.instanceOf(groupRow.getColumns()[1], GridGroupCell);
        assert.equal(groupRow.getColumns()[1].getColspan(), 3);

        assert.instanceOf(groupRow.getColumns()[2], GridItemActionsCell);
    });

    // ???????? ?????????? ???????????? ???? ??????????????, ???? ???????? ???? ???????????? ???????????????????? colspan ??????????, ???? ?? ???????????????????? grid-column
    it('has correct getColspanStyles for columns when no column', () => {
        const groupRow = new GridGroupRow({
            owner: mockedCollection,
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig: gridColumnsConfig,
            colspanGroup: false
        });

        const columns = groupRow.getColumns();

        assert.equal(columns[0].getColspanStyles(), 'grid-column: 1 / 3;');
        assert.equal(columns[1].getColspanStyles(), 'grid-column: 3 / 6;');
    });

    // ???????? ???????????????? columnScroll ??????, ???? ?? ?????????????? ???? ?????????????? ??????
    it('has correct getColspanStyles for columns', () => {
        getStickyColumnsCount = 0;
        hasColumnsScroll = false;
        const groupRow = new GridGroupRow({
            owner: mockedCollection,
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig: gridColumnsConfig,
        });

        const columns = groupRow.getColumns();

        assert.equal(columns[0].getColspanStyles(), 'grid-column: 1 / 6;');
    });

    // ?????? ?????????????? ???? ?????????????? ???? ???????? ?????????????????? ?????????????????????????? ??????????????, ??.??. ?????????? ?????????????????????? ???? ???????????? ????????????????????????
    it('getContentClasses should not return classes for padding between columns', () => {
        const groupRow = new GridGroupRow({
            owner: mockedCollection,
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig: gridColumnsConfig,
            colspanGroup: false
        });

        assert.equal(groupRow.getColumnsCount(), 3);

        const columns = groupRow.getColumns();
        CssClassesAssert.notInclude(columns[0].getContentClasses(''), [
            'controls-Grid__cell_spacingLeft',
            'controls-Grid__cell_spacingRight'
        ]);
    });

    // ?????????????????? colspanGroup ???????????? ???? ????, ?????? ???????????????? ??????????????
    it ('setColspanGroup', () => {
        const groupRow = new GridGroupRow({
            owner: mockedCollection,
            columnsConfig: gridColumnsConfig,
            gridColumnsConfig: gridColumnsConfig,
            colspanGroup: true
        });

        const columns = groupRow.getColumns();

        assert.equal(columns[0].getColspanStyles(), 'grid-column: 1 / 6;');
    });
});
