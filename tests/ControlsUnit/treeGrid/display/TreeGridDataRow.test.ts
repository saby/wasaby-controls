import { RecordSet } from 'Types/collection';
import { TreeGridCollection, TreeGridDataRow } from 'Controls/treeGrid';

describe('Controls/treeGrid/Display/TreeGridDataRow', () => {
    describe('isLastItem', () => {
        it('should ignore TreeGridNodeFooterRow item from collection', () => {
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
                ],
                keyProperty: 'id',
            });
            const treeGridCollection = new TreeGridCollection({
                collection: recordSet,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                hasChildrenProperty: 'hasChildren',
                columns: [{ width: '1px' }],
                expandedItems: [null],
                rowSeparatorSize: 's',
                nodeFooterTemplate: () => {
                    return '';
                },
            });
            // Длина всех элементов в коллекции = 4 (Две ноды и к ним два футера)
            expect(treeGridCollection.getItems().length).toEqual(4);
            expect(treeGridCollection.at(1).isBottomSeparatorEnabled()).toBe(
                true
            );
        });

        it('should return the last item', () => {
            const recordSet = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        node: null,
                    },
                    {
                        id: 2,
                        parent: null,
                        node: null,
                    },
                ],
                keyProperty: 'id',
            });
            const treeGridCollection = new TreeGridCollection({
                collection: recordSet,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [{ width: '1px' }],
                expandedItems: [null],
                rowSeparatorSize: 's',
            });
            // Длина всех элементов в коллекции = 4 (Две ноды и к ним два футера)
            expect(treeGridCollection.getItems().length).toEqual(2);
            expect(treeGridCollection.at(1).isBottomSeparatorEnabled()).toBe(
                true
            );
        });
    });

    describe('Editing', () => {
        it('', () => {
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
                ],
                keyProperty: 'id',
            });
            const treeGridCollection = new TreeGridCollection({
                collection: recordSet,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                hasChildrenProperty: 'hasChildren',
                columns: [{ width: '1px' }, { width: '100px' }],
                expandedItems: [null],
            });

            const item = treeGridCollection.at(1) as TreeGridDataRow;
            item.setEditing(true, recordSet.at(1), false, 1);
            expect(item.getEditingColumnIndex()).toEqual(1);
        });
    });
});
