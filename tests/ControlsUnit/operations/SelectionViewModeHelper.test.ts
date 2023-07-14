import { getSelectionViewMode } from 'Controls/operations';
import { RecordSet } from 'Types/collection';
import { NewSourceController } from 'Controls/dataSource';
import { Memory } from 'Types/source';

describe('Controls/_operations/Utils/SelectionViewModeHelper', () => {
    describe('getSelectionViewMode', function () {
        describe('Плоский список', function async() {
            let items;
            let source;
            let sourceController;

            beforeEach(() => {
                items = new RecordSet({
                    rawData: [
                        { id: 1, title: 'title 1' },
                        { id: 2, title: 'title 2' },
                    ],
                    keyProperty: 'id',
                });
                source = new Memory({
                    data: [
                        { id: 1, title: 'title 1' },
                        { id: 2, title: 'title 2' },
                    ],
                    keyProperty: 'id',
                });
                sourceController = new NewSourceController({
                    source,
                    navigation: {
                        source: 'page',
                        sourceConfig: {
                            pageSize: 1,
                            page: 0,
                            hasMore: false,
                        },
                    },
                });
            });

            it('Записи загружены, есть выбранные значения', function () {
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [],
                };
                sourceController.setItemsAfterLoad(items);
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('all');
            });

            it('Записи загружены, ничего не выбрано, кнопка Показать отмеченные не нажата', function () {
                const options = {
                    selectedKeys: [],
                    excludedKeys: [],
                };
                sourceController.setItemsAfterLoad(items);
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('hidden');
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Показать отмеченные', function () {
                const options = {
                    selectedKeys: [],
                    excludedKeys: [],
                };
                sourceController.setItemsAfterLoad(items);
                expect(getSelectionViewMode('selected', options, sourceController)).toBe(
                    'selected'
                );
            });

            it('Записи не загружены, нет excludedKeys, есть выбранные значения', async function () {
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [],
                };
                await sourceController.reload();
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('all');
            });

            it('Записи не загружены, есть excludedKeys, есть выбранные значения', async function () {
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [2],
                };
                await sourceController.reload();
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('all');
            });
        });

        describe('Иерархический список', function () {
            const items = new RecordSet({
                rawData: [
                    { id: 1, title: 'Parent 1', parent: null, node: true },
                    { id: 2, title: 'Child 1', parent: 1, node: false },
                    { id: 3, title: 'Parent 2', parent: null, node: true },
                    { id: 4, title: 'Child 2', parent: 3, node: true },
                ],
                keyProperty: 'id',
            });
            const sourceController = {
                hasMoreData: () => true,
                getItems: () => items,
                hasLoaded: () => true,
            };
            let selectionViewMode = 'hidden';
            const options = {
                selectedKeys: [1],
                excludedKeys: [],
                parentProperty: 'parent',
                nodeProperty: 'node',
            };

            it('Записи загружены, есть выбранные значения', function () {
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'all'
                );
            });

            it('Записи загружены, ничего не выбрано, кнопка Показать отмеченные не нажата', function () {
                options.selectedKeys = [];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'hidden'
                );
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Показать отмеченные', function () {
                selectionViewMode = 'selected';
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'selected'
                );
            });

            it('Выбранная папка загружена, есть незагруженные записи, но они не выбраны', function () {
                selectionViewMode = 'hidden';
                options.selectedKeys = [1];
                sourceController.hasMoreData = (direction, key) => {
                    return key === 4;
                };
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'all'
                );
            });

            it('Выбранная папка не загружена', function () {
                options.excludedKeys = [4];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'all'
                );
            });
        });
    });
});
