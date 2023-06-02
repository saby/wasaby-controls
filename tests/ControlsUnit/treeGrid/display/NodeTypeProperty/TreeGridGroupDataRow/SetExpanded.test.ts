import { Model } from 'Types/entity';
import {
    TreeGridCollection,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
} from 'Controls/treeGrid';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataRow/SetExpanded', () => {
    const owner = {
        getStickyColumnsCount: () => {
            return 0;
        },
        hasMultiSelectColumn: () => {
            return false;
        },
        notifyItemChange: jest.fn(),
        hasItemActionsSeparatedCell: () => {
            return false;
        },
        isFullGridSupport: () => {
            return true;
        },
        hasColumnScroll: () => {
            return false;
        },
        isStickyHeader: () => {
            return false;
        },
        isStickyGroup: () => {
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
    } as undefined as TreeGridCollection<any>;

    const columns = [{ width: '100px' }];
    const groupRow = new TreeGridGroupDataRow({
        contents: new Model({
            rawData: {
                id: 1,
                nodeType: 'group',
                parent: null,
                node: true,
                hasChildren: true,
            },
            keyProperty: 'id',
        }),
        gridColumnsConfig: columns,
        columnsConfig: columns,
        owner: {
            ...owner,
            getGridColumnsConfig: () => {
                return columns;
            },
        },
    });

    it('setExpanded set expanded state to columns', () => {
        groupRow
            .getColumns()
            .forEach((column: TreeGridGroupDataCell<Model>) => {
                expect(column.isExpanded()).toBe(true);
            });

        groupRow.setExpanded(false);
        groupRow
            .getColumns()
            .forEach((column: TreeGridGroupDataCell<Model>) => {
                expect(column.isExpanded()).toBe(false);
            });
    });
});
