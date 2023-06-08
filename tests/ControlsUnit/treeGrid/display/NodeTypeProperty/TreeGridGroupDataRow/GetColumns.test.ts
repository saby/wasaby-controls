import { TreeGridCollection, TreeGridGroupDataRow } from 'Controls/treeGrid';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataRow/GetColumns', () => {
    let groupRow: TreeGridGroupDataRow<Model>;
    let multiSelectVisibility: string;
    const columns: IColumn[] = [{ width: '100px' }];
    const owner = {
        getNavigation: jest.fn(),
        getItems: () => {
            return [groupRow];
        },
        getCount: () => {
            return 1;
        },
        getRootLevel: () => {
            return 0;
        },
        getSourceCollection: {
            getCount: () => {
                return 1;
            },
        },
        getSourceIndexByItem: () => {
            return 0;
        },
        isLastItem: () => {
            return true;
        },
        isStickyHeader: () => {
            return true;
        },
        isStickyGroup: () => {
            return true;
        },
        hasColumnScroll: () => {
            return false;
        },
        getGridColumnsConfig: () => {
            return columns;
        },
        hasMultiSelectColumn: () => {
            return multiSelectVisibility;
        },
        isFullGridSupport: () => {
            return true;
        },
        hasItemActionsSeparatedCell: () => {
            return false;
        },
        getColumnsEnumerator: () => {
            return {
                getColumnsConfig: () => {
                    return columns;
                },
            };
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

    function getGroupRow(): TreeGridGroupDataRow<Model> {
        return new TreeGridGroupDataRow({
            rowTemplate: (): string => {
                return '';
            },
            rowTemplateOptions: () => {
                return {};
            },
            isHiddenGroup: false,
            multiSelectVisibility,
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
            columns,
            isLastItem: true,
            owner,
        });
    }

    beforeEach(() => {
        multiSelectVisibility = 'hidden';
    });

    // 2, потому что колонка multiSelect не колспанится, а добавляется пустая
    it('multiSelectVisibility=visible, total columns count should be 2', () => {
        multiSelectVisibility = 'visible';
        groupRow = getGroupRow();
        expect(groupRow.getColumnsCount()).toEqual(2);
    });

    // 2, потому что колонка multiSelect не колспанится, а добавляется пустая
    it('multiSelectVisibility=visible, should not colspan', () => {
        multiSelectVisibility = 'visible';
        groupRow = getGroupRow();
        const columns = groupRow.getColumns();
        expect(columns[0].getColspanStyles()).toEqual('');
        expect(columns[1].getColspanStyles()).toEqual('');
    });
});
