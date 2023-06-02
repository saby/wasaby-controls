import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/list/display/RowSeparator/CollectionItem', () => {
    // 1.  Плоский список после инициализации
    describe('constructor', () => {
        it('_initializeCollection', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });
            expect(collection.at(1).isBottomSeparatorEnabled()).toBe(true);
        });
    });

    // Изменения в RecordSet
    describe('onCollectionChange', () => {
        // 4. remove (recordset)
        it('RecordSet + remove', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            expect(
                collection.getItemBySourceKey(3).isBottomSeparatorEnabled()
            ).toBe(false);
            recordSet.removeAt(3);
            expect(
                collection.getItemBySourceKey(3).isBottomSeparatorEnabled()
            ).toBe(true);
        });

        // 5. move (recordset)
        it('RecordSet + move', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            const initialLastItem = collection.at(3);
            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

            recordSet.move(3, 1);

            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(false);
            expect(collection.at(3).isBottomSeparatorEnabled()).toBe(true);
        });

        // 6. add (recordset)
        it('RecordSet + add', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            const item = new Model({
                rawData: { id: 3 },
                keyProperty: 'id',
            });

            const initialLastItem = collection.at(1);
            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

            recordSet.add(item, 2);

            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(false);
            expect(collection.at(2).isBottomSeparatorEnabled()).toBe(true);
        });

        // 2.1 Записи добавились через merge
        it('RecordSet + merge', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            expect(collection.at(1).isBottomSeparatorEnabled()).toBe(true);

            recordSet.merge(
                new RecordSet({
                    rawData: [{ id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                }),
                { remove: false, inject: true }
            );

            expect(collection.at(1).isBottomSeparatorEnabled()).toBe(false);
            expect(collection.at(3).isBottomSeparatorEnabled()).toBe(true);
        });

        // 2.2 Записи добавились через assign
        it('RecordSet + assign', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            const initialLastItem = collection.getItemBySourceKey(2);
            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

            recordSet.assign(
                new RecordSet({
                    rawData: [{ id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                })
            );

            expect(collection.getItemBySourceKey(2)).not.toEqual(
                initialLastItem
            );
            expect(
                collection.getItemBySourceKey(4).isBottomSeparatorEnabled()
            ).toBe(true);
        });

        // 2.3 Записи добавились через append
        it('RecordSet + append', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            expect(collection.at(1).isBottomSeparatorEnabled()).toBe(true);

            recordSet.append(
                new RecordSet({
                    rawData: [{ id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                })
            );

            expect(collection.at(1).isBottomSeparatorEnabled()).toBe(false);
            expect(collection.at(3).isBottomSeparatorEnabled()).toBe(true);
        });

        // 2.4 Записи добавились через prepend
        it('RecordSet + prepend', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
            });

            const initialFirstItem = collection.at(0);
            expect(initialFirstItem.isTopSeparatorEnabled()).toBe(true);

            recordSet.prepend(
                new RecordSet({
                    rawData: [{ id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                })
            );

            expect(initialFirstItem.isTopSeparatorEnabled()).toBe(true); // not changed
            expect(collection.at(0).isTopSeparatorEnabled()).toBe(true); // set true
        });

        // 2.4 Записи добавились через prepend
        it('RecordSet + prepend + rowSeparatorVisibility=items', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                rowSeparatorSize: 's',
                rowSeparatorVisibility: 'items',
            });

            const initialFirstItem = collection.at(0);
            expect(initialFirstItem.isTopSeparatorEnabled()).toBe(false);

            recordSet.prepend(
                new RecordSet({
                    rawData: [{ id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                })
            );

            expect(initialFirstItem.isTopSeparatorEnabled()).toBe(true); // set true
            expect(collection.at(0).isTopSeparatorEnabled()).toBe(false); // set false
        });
    });

    // 8. DragAndDrop
    it('DnD', () => {
        const recordSet = new RecordSet({
            rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            keyProperty: 'id',
        });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
            rowSeparatorSize: 's',
        });

        const initialLastItem = collection.getItemBySourceKey(4);
        const record = recordSet.getRecordById(4);

        expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

        collection.setDraggedItems(initialLastItem, [4]);
        collection.setDragPosition({
            index: 1,
            position: 'after',
            dispItem: initialLastItem,
        });
        recordSet.add(record, 2);
        recordSet.remove(record);
        collection.resetDraggedItems();

        expect(
            collection.getItemBySourceKey(4).isBottomSeparatorEnabled()
        ).toBe(false);
        expect(collection.at(3).isBottomSeparatorEnabled()).toBe(true);
    });

    describe('With groups', () => {
        // 9 Инициализация с группировкой
        it('constructor', () => {
            // Группировка всегда должна приходить от прикладника в правильном порядке
            const recordSet = new RecordSet({
                rawData: [
                    { id: 1, group: 'g1' },
                    { id: 2, group: 'g1' },
                    { id: 3, group: 'g2' },
                    { id: 4, group: 'g2' },
                    { id: 5, group: 'g3' },
                ],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                groupProperty: 'group',
                rowSeparatorSize: 's',
            });
            expect(collection.at(7).isBottomSeparatorEnabled()).toBe(true);
        });

        // 9.1 Добавили записи в RS
        it('New items added', () => {
            const recordSet = new RecordSet({
                rawData: [
                    { id: 1, group: 'g1' },
                    { id: 2, group: 'g1' },
                    { id: 3, group: 'g2' },
                    { id: 4, group: 'g2' },
                ],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                groupProperty: 'group',
                rowSeparatorSize: 's',
            });
            const itemAt5 = collection.at(5);

            expect(itemAt5.isBottomSeparatorEnabled()).toBe(true);

            const item = new Model({
                rawData: { id: 3, group: 'g2' },
                keyProperty: 'id',
            });

            recordSet.add(item, 4);

            expect(itemAt5.isBottomSeparatorEnabled()).toBe(false);
            expect(collection.at(6).isBottomSeparatorEnabled()).toBe(true);
        });

        // 10. Смена groupProperty
        it('Group changed', () => {
            const recordSet = new RecordSet({
                rawData: [
                    { id: 1, group: 'g1', group2: 'g21' },
                    { id: 2, group: 'g1', group2: 'g22' },
                    { id: 3, group: 'g2', group2: 'g22' },
                    { id: 4, group: 'g2', group2: 'g21' },
                ],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                groupProperty: 'group',
                rowSeparatorSize: 's',
            });
            const initialLastItem = collection.getItemBySourceKey(4);
            expect(initialLastItem).toEqual(collection.at(5));

            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

            collection.setGroupProperty('group2');

            expect(initialLastItem).not.toEqual(collection.at(5));
            expect(
                collection.getItemBySourceKey(3).isBottomSeparatorEnabled()
            ).toBe(true);
            expect(initialLastItem.isBottomSeparatorEnabled()).toBe(false);
        });
    });

    // 9. Create in collection
    it('create in collection', () => {
        const recordSet = new RecordSet({
            rawData: [{ id: 1 }, { id: 2 }],
            keyProperty: 'id',
        });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
            rowSeparatorSize: 's',
        });

        const item = new Model({
            rawData: {
                id: 3,
            },
            keyProperty: 'id',
        });

        const newItem = collection.createItem({
            contents: item,
            isAdd: true,
            addPosition: 'bottom',
        });

        const initialLastItem = collection.getItemBySourceKey(2);

        expect(initialLastItem.isBottomSeparatorEnabled()).toBe(true);

        newItem.setEditing(true, item, false);
        collection.setAddingItem(newItem, { position: 'bottom' });

        expect(
            collection.getItemBySourceKey(2).isBottomSeparatorEnabled()
        ).toBe(false);
        expect(newItem.isBottomSeparatorEnabled()).toBe(true);
    });

    it('setHasMoreData', () => {
        const recordSet = new RecordSet({
            rawData: [{ id: 1 }],
            keyProperty: 'id',
        });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
            rowSeparatorSize: 's',
            navigation: {
                view: 'infinity',
                viewConfig: {
                    pagingMode: 'page',
                },
            },
        });
        expect(collection.at(0).isBottomSeparatorEnabled()).toBe(true);

        collection.setHasMoreData({ up: false, down: true });
        expect(collection.at(0).isBottomSeparatorEnabled()).toBe(false);

        collection.setHasMoreData({ up: false, down: false });
        expect(collection.at(0).isBottomSeparatorEnabled()).toBe(true);
    });
});
