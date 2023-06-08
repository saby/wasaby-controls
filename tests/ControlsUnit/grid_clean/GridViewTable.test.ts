import GridViewTable from 'Controls/_grid/GridViewTable';
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
        getColumnsEnumerator: () => {
            return {
                getColumnsConfig: () => {
                    return columns;
                },
            };
        },
        getMultiSelectVisibility: () => {
            return multiSelectVisibility;
        },
        getMultiSelectPosition: () => {
            return 'default';
        },
    };

    let gridView: typeof GridViewTable;
    let options;

    beforeEach(() => {
        columns = [];
        options = {};
    });

    it('_getGridViewClasses', () => {
        gridView = new GridViewTable(options);
        gridView._listModel = listModel;
        assertClasses.include(
            gridView._getGridViewClasses(options),
            'controls-Grid_table-layout controls-Grid_table-layout_fixed'
        );
    });
});
