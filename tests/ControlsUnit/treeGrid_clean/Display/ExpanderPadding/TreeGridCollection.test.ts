import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('treeGrid/Display/ExpanderPadding/TreeGridCollection', () => {
    describe('Header', () => {
        it('should pass to headers displayExpanderPadding option', () => {
            const recordSet = new RecordSet({
                rawData: [{ key: 1, parent: null, node: null }],
                keyProperty: 'key',
            });

            const treeGridCollection = new TreeGridCollection({
                collection: recordSet,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expanderSize: 'default',
                root: null,
                columns: [{}],
                header: [{}],
                expandedItems: [1],
            });

            const headerCell = treeGridCollection.getHeader().getRow().getColumns()[0];
            CssClassesAssert.notInclude(
                headerCell.getContentClasses(),
                'controls-TreeView__expanderPadding-default'
            );

            recordSet.getRecordById(1).set('node', true);
            treeGridCollection.hasNode(); // ленивый подсчет, вызываем его
            CssClassesAssert.include(
                headerCell.getContentClasses(),
                'controls-TreeView__expanderPadding-default'
            );
        });
    });
});
