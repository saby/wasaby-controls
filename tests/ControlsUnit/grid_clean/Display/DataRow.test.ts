import { GridDataRow, GridCollection } from 'Controls/grid';
import { Model } from 'Types/entity';
import { CssClassesAssert as cAssert } from '../../CustomAsserts';

const rawData = {
    key: 1,
    firstStickyProperty: 'first',
    secondStickyProperty: 'second',
    caption: 'item_1',
};
let columnsConfig = null;
let multiSelectVisibility = 'hidden';
let style: string;

const mockedCollection = {
    getLeftPadding: () => {
        return 'null';
    },
    getStickyColumnsCount: () => {
        return 0;
    },
    hasMultiSelectColumn: () => {
        return multiSelectVisibility === 'visible';
    },
    hasItemActionsSeparatedCell: () => {
        return false;
    },
    getGridColumnsConfig: () => {
        return columnsConfig;
    },
    getIndex: () => {
        return 0;
    },
    notifyItemChange: jest.fn(),
    getItemEditorTemplate: jest.fn(),
    hasColumnScroll: () => {
        return false;
    },
    isFullGridSupport: () => {
        return true;
    },
    getItemEditorTemplateOptions: jest.fn(),
    hasSpacingColumn: () => {
        return false;
    },
    hasResizer: () => {
        return false;
    },
    hasColumnScrollReact: () => {
        return false;
    },
    isDragging: () => {
        return false;
    },
    getGroupViewMode: () => {
        return 'default';
    },
} as GridCollection<Model>;

describe('Controls/grid_clean/Display/DataRow', () => {
    let record: Model;

    beforeEach(() => {
        record = new Model({
            rawData,
            keyProperty: 'key',
        });
        style = 'default';
    });

    afterEach(() => {
        columnsConfig = null;
        record = undefined;
    });

    it('Generate columns.instanceId', () => {
        columnsConfig = [
            {
                displayProperty: 'key',
            },
            {
                displayProperty: 'caption',
            },
        ];
        const gridRow = new GridDataRow({
            owner: {
                ...mockedCollection,
                getMultiSelectPosition: () => {
                    return 'default';
                },
            },
            gridColumnsConfig: columnsConfig,
            columnsConfig,
            contents: record,
        });

        let columns = gridRow.getColumns();
        expect(columns.length).toBe(2);
        expect(columns[0].getInstanceId()).toBe('1_column_0');
        expect(columns[1].getInstanceId()).toBe('1_column_1');

        const newRecord = new Model({
            rawData,
            keyProperty: 'key',
        });

        gridRow.setContents(newRecord);

        columns = gridRow.getColumns();
        expect(columns.length).toBe(2);
        expect(columns[0].getInstanceId()).toBe('1_column_0');
        expect(columns[1].getInstanceId()).toBe('1_column_1');

        multiSelectVisibility = 'visible';
        gridRow.setMultiSelectVisibility('visible');

        columns = gridRow.getColumns();
        expect(columns.length).toBe(3);
        expect(columns[0].getInstanceId()).toBe('1_column_checkbox');
        expect(columns[1].getInstanceId()).toBe('1_column_0');
        expect(columns[2].getInstanceId()).toBe('1_column_1');

        multiSelectVisibility = 'hidden';
        gridRow.setMultiSelectVisibility('hidden');

        columns = gridRow.getColumns();
        expect(columns.length).toBe(2);
        expect(columns[0].getInstanceId()).toBe('1_column_0');
        expect(columns[1].getInstanceId()).toBe('1_column_1');
    });

    it('Initialize with ladder', () => {
        columnsConfig = [
            {
                stickyProperty: ['firstStickyProperty', 'secondStickyProperty'],
                width: '100px',
            },
            {
                displayProperty: 'caption',
                width: '100px',
            },
        ];
        const initialLadder = {
            ladder: {
                firstStickyProperty: {
                    ladderLength: 5,
                },
                secondStickyProperty: {
                    ladderLength: 2,
                },
            },
            stickyLadder: {
                firstStickyProperty: {
                    ladderLength: 5,
                    headingStyle: 'grid-row: span 5',
                },
                secondStickyProperty: {
                    ladderLength: 2,
                    headingStyle: 'grid-row: span 2',
                },
            },
        };

        const secondLadder = {
            ladder: {
                firstStickyProperty: {
                    ladderLength: 3,
                },
                secondStickyProperty: {
                    ladderLength: 1,
                },
            },
            stickyLadder: {
                firstStickyProperty: {
                    ladderLength: 3,
                    headingStyle: 'grid-row: span 3',
                },
                secondStickyProperty: {
                    ladderLength: 1,
                    headingStyle: 'grid-row: span 1',
                },
            },
        };

        const gridRow = new GridDataRow({
            owner: mockedCollection,
            gridColumnsConfig: columnsConfig,
            columnsConfig,
            contents: record,
        });
        expect(gridRow.getVersion()).toBe(0);

        gridRow.updateLadder(initialLadder.ladder, initialLadder.stickyLadder);

        let columnsItems = gridRow.getColumns();
        expect(columnsItems.length).toBe(4);
        expect(gridRow.getVersion()).toBe(1);

        gridRow.updateLadder(initialLadder.ladder, initialLadder.stickyLadder);
        columnsItems = gridRow.getColumns();
        expect(columnsItems.length).toBe(4);
        expect(gridRow.getVersion()).toBe(1);

        gridRow.updateLadder(secondLadder.ladder, secondLadder.stickyLadder);
        columnsItems = gridRow.getColumns();
        expect(columnsItems.length).toBe(4);
        expect(gridRow.getVersion()).toBe(2);
    });

    it('Set editing of separated column', () => {
        columnsConfig = [
            {
                displayProperty: 'key',
            },
            {
                displayProperty: 'caption',
            },
        ];
        const gridRow = new GridDataRow({
            owner: {
                ...mockedCollection,
                getEditingConfig: () => {
                    return {
                        mode: 'cell',
                    };
                },
            },
            gridColumnsConfig: columnsConfig,
            columnsConfig,
            contents: record,
        });

        gridRow.setEditing(true, gridRow.contents, false, 1);
        const columns = gridRow.getColumns();
        expect(columns[0].isEditing()).toBe(false);
        expect(columns[1].isEditing()).toBe(true);
    });

    it('editing with itemEditorTemplate', () => {
        columnsConfig = [
            {
                displayProperty: 'key',
            },
            {
                displayProperty: 'caption',
            },
        ];
        const gridRow = new GridDataRow({
            owner: {
                ...mockedCollection,
                getEditingConfig: () => {
                    return {};
                },
                getItemEditorTemplate: () => {
                    return 'ITEM_EDITOR_TEMPLATE';
                },
            },
            gridColumnsConfig: columnsConfig,
            columnsConfig,
            contents: record,
        });

        gridRow.setEditing(true, gridRow.contents, false, 1);
        expect(gridRow.getColumns().length).toEqual(1);
    });

    it('update isMarked state affects cells', () => {
        style = 'master';
        columnsConfig = [
            {
                displayProperty: 'key',
            },
            {
                displayProperty: 'caption',
            },
        ];
        const gridRow = new GridDataRow({
            owner: {
                ...mockedCollection,
                getStyle: () => {
                    return style;
                },
                isStickyMarkedItem: () => {
                    return undefined;
                },
                getTopPadding: () => {
                    return '#topSpacing#';
                },
                getBottomPadding: () => {
                    return '#bottomSpacing#';
                },
                getLeftPadding: () => {
                    return '#leftSpacing#';
                },
                getRightPadding: () => {
                    return '#rightSpacing#';
                },
                getEditingConfig: () => {
                    return {};
                },
                getItemEditorTemplate: () => {
                    return 'ITEM_EDITOR_TEMPLATE';
                },
                getEditingBackgroundStyle: () => {
                    return 'default';
                },
                isEditing: () => {
                    return false;
                },
            },
            gridColumnsConfig: columnsConfig,
            columnsConfig,
            contents: record,
            backgroundStyle: 'master',
            style: 'master',
        });

        gridRow.setMarked(true);

        cAssert.include(gridRow.getColumns()[0].getWrapperClasses(), 'controls-background-master');

        gridRow.setMarked(false);

        cAssert.notInclude(
            gridRow.getColumns()[0].getWrapperClasses(),
            'controls-background-master'
        );
    });
});
