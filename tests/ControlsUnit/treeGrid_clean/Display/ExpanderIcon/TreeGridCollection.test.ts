import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('treeGrid/Display/ExpanderIcon/TreeGridCollection', () => {
    const recordSet = new RecordSet({
        rawData: [{ key: 1, parent: null, node: null }],
        keyProperty: 'key',
    });

    function getTreeGridCollection(options?: object): TreeGridCollection {
        return new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'node',
            root: null,
            columns: [{}],
            expandedItems: [1],
            ...options,
        });
    }

    describe('expanderIconStyle', () => {
        it('should pass to row expanderIconStyle option', () => {
            const itemAt0 = getTreeGridCollection({
                expanderIconStyle: 'unaccented',
            }).at(0);
            expect(itemAt0.getExpanderIconStyle()).toEqual('unaccented');
        });
    });

    describe('expanderIcon', () => {
        it('should pass to row expanderIcon option', () => {
            const itemAt0 = getTreeGridCollection({
                expanderIcon: 'hiddenNode',
            }).at(0);
            expect(itemAt0.getExpanderIcon()).toEqual('hiddenNode');
        });
    });
});
