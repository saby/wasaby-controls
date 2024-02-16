import { Model } from 'Types/entity';
import { TreeGridCollection, TreeGridGroupDataRow } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataRow/GetItemClasses', () => {
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
    } as undefined as TreeGridCollection<any>;

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
        columns: [{ width: '100px' }],
        owner,
    });

    it('getLevel() should return current level - 1', () => {
        expect(groupRow.getLevel()).toBe(-1);
    });
});
