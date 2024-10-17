import { GridGroupRow } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('ControlsUnit/grid_clean/Display/Group/Spacing/GroupCell', () => {
    let hasColumnsScroll: boolean;
    let multiSelectVisibility: string;

    const getCollection = () => {
        return getGridCollectionMock({
            gridColumnsConfig: [{}, {}, {}, {}, {}],
            hasColumnScroll: hasColumnsScroll,
            hasItemActionsSeparatedCell: true,
            hoverBackgroundStyle: 'default',
            multiSelectVisibility,
        });
    };

    beforeEach(() => {
        hasColumnsScroll = false;
        multiSelectVisibility = 'hidden';
    });

    // слева и справа от группировки должен быть разделитель
    it('getContentClasses should return classes for the only column', () => {
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: getCollection().getGridColumnsConfig(),
            gridColumnsConfig: getCollection().getGridColumnsConfig(),
        });

        const columns = groupRow.getColumns();
        CssClassesAssert.notInclude(columns[0].getContentClasses(''), [
            'controls-controls-Grid__cell_spacingFirstCol_default',
            'controls-controls-Grid__cell_spacingLastCol_default',
        ]);
    });

    // слева и справа от группировки должен быть разделитель даже если включен multiSelect
    it('getContentClasses should return classes for the only column + multiselect', () => {
        multiSelectVisibility = 'visible';
        const groupRow = new GridGroupRow({
            owner: getCollection(),
            columnsConfig: getCollection().getGridColumnsConfig(),
            gridColumnsConfig: getCollection().getGridColumnsConfig(),
        });

        const columns = groupRow.getColumns();
        CssClassesAssert.notInclude(columns[0].getContentClasses(''), [
            'controls-controls-Grid__cell_spacingFirstCol_default',
            'controls-controls-Grid__cell_spacingLastCol_default',
        ]);
    });
});
