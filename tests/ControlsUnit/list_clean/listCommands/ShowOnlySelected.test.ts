import { ShowOnlySelected } from 'Controls/listCommands';
import { RecordSet } from 'Types/collection';

describe('Controls/_listCommands/ShowOnlySelected', () => {
    describe('execute', function () {
        let selectedKeys = [1];
        let excludedKeys = [];
        const testItems = new RecordSet({
            rawData: [
                { id: 1, title: 'Parent 1', parent: null, node: true },
                { id: 2, title: 'Child 1', parent: 1, node: false },
                { id: 3, title: 'Parent 2', parent: null, node: true },
                { id: 4, title: 'Child 2', parent: 3, node: true },
            ],
            keyProperty: 'id',
        });
        describe('Плоский список', function () {
            it('Выбрана запись', function () {
                const items = testItems.clone();
                const selectedItems = [testItems.getRecordById(1)];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selectedKeys,
                    excludedKeys,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
            });

            it('Выбраны записи, которые есть в excludedKeys', function () {
                selectedKeys = [1, 2];
                const selectedItems = [testItems.getRecordById(1)];
                excludedKeys = [2];
                const items = testItems.clone();
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selectedKeys,
                    excludedKeys,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
            });
        });

        describe('Иерархический список', function () {
            excludedKeys = [];
            const parentProperty = 'parent';
            const nodeProperty = 'node';
            const root = null;
            it('Выбраны папки', function () {
                selectedKeys = [1, 3];
                const items = testItems.clone();
                const selectedItems = [
                    testItems.getRecordById(1),
                    testItems.getRecordById(2),
                    testItems.getRecordById(3),
                    testItems.getRecordById(4),
                ];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selectedKeys,
                    parentProperty,
                    nodeProperty,
                    root,
                    excludedKeys,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(4);
                expect(items.getRecordById(1).get(parentProperty)).toBe(root);
                expect(items.getRecordById(3).get(parentProperty)).toBe(root);
            });

            it('Выбраны листья', function () {
                selectedKeys = [4];
                const selectedItems = [testItems.getRecordById(4)];
                const items = testItems.clone();
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selectedKeys,
                    parentProperty,
                    nodeProperty,
                    root,
                    excludedKeys,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
                expect(items.getRecordById(4).get(parentProperty)).toBe(root);
            });

            it('Выбрана папка и ее содержимое', function () {
                selectedKeys = [3, 4];
                const items = testItems.clone();
                const selectedItems = [testItems.getRecordById(3), testItems.getRecordById(4)];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selectedKeys,
                    parentProperty,
                    nodeProperty,
                    root,
                    excludedKeys,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(2);
                expect(items.getRecordById(3).get(parentProperty)).toBe(root);
                expect(items.getRecordById(4).get(parentProperty)).toBe(3);
            });
        });
    });
});
