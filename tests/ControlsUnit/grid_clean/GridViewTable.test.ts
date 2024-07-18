import { default as GridView } from 'Controls/_grid/GridView';
import GridViewTableCtor from 'Controls/_gridIE/GridView';
import { CssClassesAssert as assertClasses } from 'ControlsUnit/CustomAsserts';

describe('Controls/grid_clean/GridViewTable', () => {
    let columns = [];
    let multiSelectVisibility: string;

    const listModel = {
        isDragging: () => {
            return false;
        },
        getGridColumnsConfig: () => {
            return columns;
        },
        getMultiSelectVisibility: () => {
            return multiSelectVisibility;
        },
        getMultiSelectPosition: () => {
            return 'default';
        },
    };

    let gridView;
    let options;

    beforeEach(() => {
        columns = [];
        options = {};
    });

    it('_getGridViewClasses', () => {
        const classCtor = GridViewTableCtor(GridView);
        gridView = new classCtor(options);
        gridView._listModel = listModel;
        assertClasses.include(
            gridView._getGridViewClasses(options),
            'controls-Grid_table-layout controls-Grid_table-layout_fixed'
        );
    });
});
