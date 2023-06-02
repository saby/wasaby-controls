import { RecordSet } from 'Types/collection';
import { TreeGridCollection, TreeGridDataRow } from 'Controls/treeGrid';

const rawData = [
    {
        key: 1,
        col1: 'c1-1',
        col2: 'с2-1',
        parent: null,
        type: true,
        nodeType: 'group',
    },
    {
        key: 2,
        col1: 'c1-2',
        col2: 'с2-2',
        parent: 1,
        type: null,
        nodeType: null,
    },
    {
        key: 3,
        col1: 'c1-3',
        col2: 'с2-3',
        parent: 1,
        type: null,
        nodeType: null,
    },
    {
        key: 4,
        col1: 'c1-4',
        col2: 'с2-4',
        parent: 1,
        type: null,
        nodeType: null,
    },
];
const columns = [{ displayProperty: 'col1' }, { displayProperty: 'col2' }];

describe('Controls/treeGrid_clean/Display/StickyGroup/HasStickyGroup', () => {
    let collection: RecordSet;
    beforeEach(() => {
        collection = new RecordSet({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        collection = undefined;
    });

    it('Initialize with stickyHeader and groups', () => {
        const treeGridCollection = new TreeGridCollection({
            collection,
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            nodeTypeProperty: 'nodeType',
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });
        treeGridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).toBe(true);
            }
        });
    });
    it('Initialize without stickyHeader and with groups', () => {
        const treeGridCollection = new TreeGridCollection({
            collection,
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            nodeTypeProperty: 'nodeType',
            keyProperty: 'key',
            columns,
        });
        treeGridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });
    it('Initialize with stickyHeader and without groups', () => {
        const treeGridCollection = new TreeGridCollection({
            collection,
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            nodeTypeProperty: 'type',
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });
        treeGridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });
    it('Initialize without stickyHeader and groups', () => {
        const treeGridCollection = new TreeGridCollection({
            collection,
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            nodeTypeProperty: 'type',
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });
        treeGridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });

    it('updateHasStickyGroup', () => {
        const treeGridCollection = new TreeGridCollection({
            collection,
            keyProperty: 'key',
            parentProperty: 'parent',
            root: null,
            nodeProperty: 'type',
            nodeTypeProperty: 'nodeType',
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });

        expect(treeGridCollection.getVersion()).toBe(3);

        treeGridCollection
            .getViewIterator()
            .each((item: TreeGridDataRow<any>) => {
                if (item.LadderSupport) {
                    jest.spyOn(item, 'setHasStickyGroup').mockClear();
                }
            });

        treeGridCollection.setNodeTypeProperty('nodeType');

        expect(treeGridCollection.getVersion()).toBe(4);
        treeGridCollection
            .getViewIterator()
            .each((item: TreeGridDataRow<any>) => {
                if (item.LadderSupport) {
                    expect(item.setHasStickyGroup).toHaveBeenCalledTimes(1);
                    expect(item.setHasStickyGroup.mock.calls[0][0]).toBe(true);
                }
            });

        jest.restoreAllMocks();
    });
});
