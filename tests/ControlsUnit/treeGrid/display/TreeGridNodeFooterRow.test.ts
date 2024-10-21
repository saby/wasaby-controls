import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import TreeGridNodeFooterRow from 'Controls/_treeGridDisplay/TreeGridNodeFooterRow';

describe('Controls/_treeGridDisplay/TreeGridNodeFooterRow', () => {
    const recordSet = new RecordSet({
        rawData: [
            {
                id: 1,
                parent: null,
                node: true,
                hasChildren: true,
            },
            {
                id: 2,
                parent: 1,
                node: false,
                hasChildren: false,
            },
            {
                id: 3,
                parent: 2,
                node: false,
                hasChildren: false,
            },
            {
                id: 4,
                parent: 2,
                node: null,
                hasChildren: false,
            },
            {
                id: 5,
                parent: 1,
                node: null,
                hasChildren: false,
            },
            {
                id: 6,
                parent: null,
                node: true,
                hasChildren: false,
            },
            {
                id: 7,
                parent: null,
                node: null,
                hasChildren: false,
            },
        ],
        keyProperty: 'id',
    });

    const getCollection = (options = {}) => {
        return new TreeGridCollection({
            collection: recordSet,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
            hasChildrenProperty: 'hasChildren',
            columns: [
                {
                    displayProperty: 'title',
                    width: '300px',
                    template: 'wml!template1',
                },
                {
                    displayProperty: 'taxBase',
                    width: '200px',
                    template: 'wml!template1',
                },
            ],
            expandedItems: [null],
            nodeFooterTemplate: () => {
                return '';
            },
            ...options,
        });
    };

    let treeGridCollection;
    let nodeFooterRow;

    beforeEach(() => {
        treeGridCollection = getCollection();

        nodeFooterRow = treeGridCollection.at(3) as TreeGridNodeFooterRow;
    });

    it('.getColumns()', () => {
        let columns = nodeFooterRow.getColumns();
        expect(columns.length).toEqual(1);

        treeGridCollection.setMultiSelectVisibility('visible');
        columns = nodeFooterRow.getColumns();
        expect(columns.length).toEqual(2);
    });

    it('.getItemClasses()', () => {
        CssClassesAssert.isSame(
            nodeFooterRow.getItemClasses(),
            'controls-ListView__itemV controls-Grid__row controls-TreeGrid__nodeFooter'
        );
    });

    it('.shouldDisplayExtraItem()', () => {
        expect(nodeFooterRow.shouldDisplayExtraItem(undefined)).toBe(false);
        expect(nodeFooterRow.shouldDisplayExtraItem({})).toBe(true);

        treeGridCollection.setHasMoreStorage({
            3: { forward: true, backward: false },
        });
        expect(nodeFooterRow.shouldDisplayExtraItem(undefined)).toBe(true);
    });
});
