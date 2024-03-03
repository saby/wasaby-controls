import { getSelectionViewMode } from 'Controls/operations';
import { RecordSet } from 'Types/collection';
import { NewSourceController } from 'Controls/dataSource';
import { Memory } from 'Types/source';

describe('Controls/_operations/Utils/SelectionViewModeHelper', () => {
    describe('getSelectionViewMode', function () {
        describe('Плоский список', function async() {
            function getItems() {
                return new RecordSet({
                    rawData: [
                        { id: 1, title: 'title 1' },
                        { id: 2, title: 'title 2' },
                    ],
                    keyProperty: 'id',
                });
            }

            const source = new Memory({
                data: [
                    { id: 1, title: 'title 1' },
                    { id: 2, title: 'title 2' },
                ],
                keyProperty: 'id',
            });

            const navigation = {
                source: 'page',
                sourceConfig: {
                    pageSize: 1,
                    page: 0,
                    hasMore: false,
                },
            };

            function getSourceController(): NewSourceController {
                return new NewSourceController({
                    source,
                });
            }

            function getSourceControllerWithNavigation(): NewSourceController {
                return new NewSourceController({
                    source,
                    navigation,
                });
            }

            it('Записи загружены, есть выбранные значения', function () {
                const sourceController = getSourceController();
                sourceController.setItemsAfterLoad(getItems());
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [],
                    sourceController,
                };
                sourceController.setItemsAfterLoad(getItems());
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('all');
            });

            it('Записи загружены, отмечены все записи, ранее нажимали на "Отобрать отмеченные"', function () {
                const sourceController = getSourceController();
                sourceController.setItemsAfterLoad(getItems());
                const options = {
                    selectedKeys: [null],
                    excludedKeys: [null],
                    sourceController,
                };
                sourceController.setItemsAfterLoad(getItems());
                expect(getSelectionViewMode('selected', options, sourceController)).toBe(
                    'selected'
                );
            });

            it('Кнопка "Отобрать отмеченные" не должна показываться в плоском списке, если отмечены все записи', () => {
                const sourceController = getSourceController();
                sourceController.setItemsAfterLoad(getItems());
                const options = {
                    selectedKeys: [null],
                    excludedKeys: [],
                    sourceController,
                };
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('hidden');
            });

            it('Записи загружены, ничего не выбрано, кнопка Отобрать отмеченные не нажата', function () {
                const sourceController = getSourceController();
                sourceController.setItemsAfterLoad(getItems());
                const options = {
                    selectedKeys: [],
                    excludedKeys: [],
                    sourceController,
                };
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('hidden');
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Отобрать отмеченные', function () {
                const sourceController = getSourceController();
                sourceController.setItemsAfterLoad(getItems());
                const options = {
                    selectedKeys: [],
                    excludedKeys: [],
                    sourceController,
                };
                expect(getSelectionViewMode('selected', options, sourceController)).toBe(
                    'selected'
                );
            });

            it('Записи не загружены, нет excludedKeys, есть выбранные значения', async function () {
                const sourceController = getSourceControllerWithNavigation();
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [],
                    sourceController,
                };
                await sourceController.reload();
                expect(getSelectionViewMode('hidden', options, sourceController)).toBe('all');
            });

            it('Записи не загружены, есть excludedKeys, есть выбранные значения', async function () {
                const sourceController = getSourceControllerWithNavigation();
                const options = {
                    selectedKeys: [1],
                    excludedKeys: [2],
                    sourceController,
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
                hasMoreData: () => false,
                getItems: () => items,
                hasLoaded: () => true,
            };
            let selectionViewMode = 'hidden';
            const options = {
                selectedKeys: [1],
                excludedKeys: [],
                parentProperty: 'parent',
                nodeProperty: 'node',
                sourceController,
            };

            it('Записи загружены, есть выбранные значения', function () {
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'all'
                );
            });

            it('Записи загружены, ничего не выбрано, кнопка Отобрать отмеченные не нажата', function () {
                options.selectedKeys = [];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe(
                    'hidden'
                );
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Отобрать отмеченные', function () {
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
