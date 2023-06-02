import { RecordSet } from 'Types/collection';
import {
    TreeGridCollection,
    TreeGridDataRow,
    TreeGridGroupDataRow,
} from 'Controls/treeGrid';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridCollection/ItemsFactoryResolver', () => {
    let collection: TreeGridCollection<any>;
    const recordSet = new RecordSet({
        rawData: [
            {
                id: 1,
                nodeType: 'group',
                parent: null,
                node: true,
                hasChildren: false,
            },
            {
                id: 2,
                nodeType: 'wrong',
                parent: null,
                node: true,
                hasChildren: false,
            },
            {
                id: 3,
                parent: null,
                node: true,
                hasChildren: false,
            },
        ],
        keyProperty: 'id',
    });

    beforeEach(() => {
        collection = new TreeGridCollection({
            nodeTypeProperty: 'nodeType',
            columns: [],
            collection: recordSet,
            keyProperty: 'id',
        });
    });

    describe('.items', () => {
        it('First element should be TreeGridGroupDataRow', () => {
            expect(collection.at(0)).toBeInstanceOf(TreeGridGroupDataRow);
        });

        it('Second element should be TreeGridDataRow', () => {
            expect(collection.at(1)).toBeInstanceOf(TreeGridDataRow);
        });

        it('Third element should be TreeGridDataRow', () => {
            expect(collection.at(2)).toBeInstanceOf(TreeGridDataRow);
        });
    });
});
