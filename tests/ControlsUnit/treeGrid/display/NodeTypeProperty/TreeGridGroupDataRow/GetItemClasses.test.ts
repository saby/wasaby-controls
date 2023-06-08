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
        getSourceCollection: {
            getCount: () => {
                return 1;
            },
        },
        getSourceIndexByItem: () => {
            return 0;
        },
        isFullGridSupport: () => {
            return true;
        },
        getEditingConfig: () => {
            return {};
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

    it('getItemClasses() should return classes for group item', () => {
        CssClassesAssert.isSame(
            groupRow.getItemClasses({}),
            [
                'controls-ListView__itemV',
                'controls-Grid__row',
                'controls-Grid__row_default',
                'controls-ListView__itemV_cursor-pointer',
                'controls-ListView__item_showActions',
                'controls-hover-background-default',
                'controls-ListView__group',
                'controls-TreeGrid__groupNode',
            ].join(' ')
        );
    });
});
