import { ShowOnlySelected } from 'Controls/listCommands';
import { RecordSet } from 'Types/collection';
import { adapter } from 'Types/entity';

describe('Controls/_listCommands/ShowOnlySelected', () => {
    describe('execute', function () {
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
                    selection: {
                        selected: [1],
                        excluded: [],
                    },
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
            });

            it('При вызове команды генерируется одно событие onCollectionChange на RecordSet', () => {
                const items = testItems.clone();
                const selectedItems = [testItems.getRecordById(2), testItems.getRecordById(4)];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [2, 4],
                        excluded: [],
                    },
                    selectedItems,
                });
                let collectionChangedCount = 0;
                items.subscribe('onCollectionChange', () => {
                    collectionChangedCount += 1;
                });
                showOnlySelected.execute();
                expect(collectionChangedCount).toBe(1);
            });

            it('Выбраны записи, которые есть в excludedKeys', function () {
                const selectedItems = [testItems.getRecordById(1)];
                const items = testItems.clone();
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [1, 2],
                        excluded: [2],
                    },
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
            });

            it('Формат отмеченных записей и формат рекордсета списка отличается, записи должны добавиться без ошибок и не потерять поля в формате', () => {
                const items = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [[1, 'first item']],
                        s: [
                            { n: 'id', t: 'Строка' },
                            { n: 'title', t: 'Строка' },
                        ],
                    },
                    keyProperty: 'id',
                });
                const extraItems = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [[2, 'Особый элемент для проверки формата', 'second item']],
                        s: [
                            { n: 'id', t: 'Строка' },
                            { n: 'description', t: 'Строка' },
                            { n: 'title', t: 'Строка' },
                        ],
                    },
                    keyProperty: 'id',
                });

                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [1, 2],
                        excluded: [],
                    },
                    selectedItems: [items.at(0), extraItems.at(0)],
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(2);
                expect(items.getRecordById(1).get('title')).toBe('first item');
                expect(items.getRecordById(2).get('title')).toBe('second item');
            });
        });

        describe('Иерархический список', function () {
            const parentProperty = 'parent';
            const nodeProperty = 'node';
            const root = null;
            it('Выбраны папки', function () {
                const items = testItems.clone();
                const selectedItems = [
                    testItems.getRecordById(1),
                    testItems.getRecordById(2),
                    testItems.getRecordById(3),
                    testItems.getRecordById(4),
                ];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [1, 3],
                        excluded: [],
                    },
                    parentProperty,
                    nodeProperty,
                    root,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(4);
                expect(items.getRecordById(1).get(parentProperty)).toBe(root);
                expect(items.getRecordById(3).get(parentProperty)).toBe(root);
            });

            it('Выбраны листья', function () {
                const selectedItems = [testItems.getRecordById(4)];
                const items = testItems.clone();
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [4],
                        excluded: [],
                    },
                    parentProperty,
                    nodeProperty,
                    root,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(1);
                expect(items.getRecordById(4).get(parentProperty)).toBe(root);
            });

            it('Выбрана папка и ее содержимое', function () {
                const items = testItems.clone();
                const selectedItems = [testItems.getRecordById(3), testItems.getRecordById(4)];
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [3, 4],
                        excluded: [],
                    },
                    parentProperty,
                    nodeProperty,
                    root,
                    selectedItems,
                });
                showOnlySelected.execute();
                expect(items.getCount()).toBe(2);
                expect(items.getRecordById(3).get(parentProperty)).toBe(root);
                expect(items.getRecordById(4).get(parentProperty)).toBe(3);
            });

            it('При выполнении команды должны отобраться записи, даже если они из разных папок и их нет в оригинальном рекордсете', () => {
                const selectedItems = [testItems.getRecordById(2), testItems.getRecordById(4)];
                const items = new RecordSet({
                    rawData: [{ id: 2, title: 'Child 1', parent: 1, node: false }],
                    keyProperty: 'id',
                });
                const root = 1;
                const showOnlySelected = new ShowOnlySelected({
                    items,
                    selection: {
                        selected: [3, 4],
                        excluded: [],
                    },
                    parentProperty,
                    nodeProperty,
                    root,
                    selectedItems,
                });
                showOnlySelected.execute();

                expect(items.getCount()).toBe(2);
                expect(items.getRecordById(2)).toBeDefined();
                expect(items.getRecordById(4)).toBeDefined();
                expect(items.getIndexByValue('id', 2)).toBe(0);
                expect(items.getIndexByValue('id', 4)).toBe(1);
            });
        });

        describe('supportSelection', function () {
            let loadCalled = false;
            let loadedFilter;

            const sourceController = {
                getSource: () => {
                    return { getAdapter: () => 'adapter.sbis' };
                },
                getFilter: () => {},
                load: (direction, key, filter) => {
                    loadedFilter = filter;
                    loadCalled = true;
                    return Promise.resolve();
                },
            };

            it('Установлена опция supportSelection, список перезагружается', function () {
                const items = testItems.clone();
                const selectedItems = [testItems.getRecordById(1)];
                const showOnlySelected = new ShowOnlySelected({
                    supportSelection: true,
                    items,
                    selection: {
                        selected: [],
                        excluded: [],
                    },
                    selectedItems,
                    sourceController,
                });
                showOnlySelected.execute();
                expect(loadCalled).toBe(true);
                expect(loadedFilter.hasOwnProperty('selection')).toBe(true);
            });
        });
    });
});
