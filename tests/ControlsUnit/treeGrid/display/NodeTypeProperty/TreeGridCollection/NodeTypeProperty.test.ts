import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridCollection/NodeTypeProperty', () => {
    let collection: TreeGridCollection<any>;
    const recordSet = new RecordSet({
        rawData: [],
        keyProperty: 'id',
    });

    it('Set nodeTypeProperty using setter', () => {
        collection = new TreeGridCollection({
            columns: [],
            collection: recordSet,
            keyProperty: 'id',
        });

        expect(collection.getNodeTypeProperty()).toBeNull();
        expect(collection.getVersion()).toBe(2);

        collection.setNodeTypeProperty('nodeType');

        expect(collection.getNodeTypeProperty()).toEqual('nodeType');
        expect(collection.getVersion()).toBe(3);
    });

    it('Set nodeTypeProperty via constructor', () => {
        collection = new TreeGridCollection({
            nodeTypeProperty: 'nodeType',
            columns: [],
            collection: recordSet,
            keyProperty: 'id',
        });
        expect(collection.getNodeTypeProperty()).toEqual('nodeType');
    });
});
