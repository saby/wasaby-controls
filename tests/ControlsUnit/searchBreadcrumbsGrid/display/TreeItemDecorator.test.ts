import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import { RecordSet } from 'Types/collection';

function getRecordSet(): RecordSet {
    return new RecordSet({
        rawData: [
            {
                id: 1,
                title: 'crumb-1',
                parent: null,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 2,
                title: 'crumb-2',
                parent: 1,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 3,
                title: 'hidden-node-level-3',
                parent: 2,
                node: false,
                hasChildren: true,
            },
            {
                id: 4,
                title: 'leaf-level-4',
                parent: 3,
                node: null,
                hasChildren: false,
            },
            {
                id: 5,
                title: 'crumb-3',
                parent: null,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 6,
                title: 'hidden-node-level-2',
                parent: 5,
                node: false,
                hasChildren: true,
            },
            {
                id: 7,
                title: 'leaf-level-3',
                parent: 6,
                node: null,
                hasChildren: false,
            },
            {
                id: 8,
                title: 'crumb-4',
                parent: null,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 9,
                title: 'crumb-5',
                parent: 8,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 10,
                title: 'crumb-6',
                parent: 9,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 11,
                title: 'crumb-7',
                parent: 10,
                node: true,
                hasChildren: true,
                multiSelectAccessibility: false,
            },
            {
                id: 12,
                title: 'hidden-node-level-5',
                parent: 11,
                node: false,
                hasChildren: true,
            },
            {
                id: 13,
                title: 'leaf-level-6',
                parent: 12,
                node: null,
                hasChildren: false,
            },
        ],
        keyProperty: 'id',
    });
}

describe('Controls/_searchBreadcrumbsGrid/display/TreeItemDecorator', () => {
    let searchGridCollection;

    beforeEach(() => {
        searchGridCollection = new SearchGridCollection({
            collection: getRecordSet(),
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
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
        });
    });

    describe('getLevel', () => {
        it('change level to 1 for hidden node (3->2)', () => {
            const item = searchGridCollection.at(1);
            expect(item.contents.get('title')).toEqual('hidden-node-level-3');
            expect(item.getLevel()).toEqual(2);
        });
        it('change level to 2 for the child of hidden node (4->3)', () => {
            const item = searchGridCollection.at(2);
            expect(item.contents.get('title')).toEqual('leaf-level-4');
            expect(item.getLevel()).toEqual(3);
        });
        it('change level to 1 for hidden node (5->2)', () => {
            const item = searchGridCollection.at(7);
            expect(item.contents.get('title')).toEqual('hidden-node-level-5');
            expect(item.getLevel()).toEqual(2);
        });
        it('change level to 2 for the child of hidden node (6->3)', () => {
            const item = searchGridCollection.at(8);
            expect(item.contents.get('title')).toEqual('leaf-level-6');
            expect(item.getLevel()).toEqual(3);
        });
        it('not change level for hidden node (2->2)', () => {
            const item = searchGridCollection.at(4);
            expect(item.contents.get('title')).toEqual('hidden-node-level-2');
            expect(item.getLevel()).toEqual(2);
        });
        it('not change level for the child of hidden node (3->3)', () => {
            const item = searchGridCollection.at(5);
            expect(item.contents.get('title')).toEqual('leaf-level-3');
            expect(item.getLevel()).toEqual(3);
        });
    });
});
