import { getSelectionViewMode } from 'Controls/operations';
import { RecordSet } from 'Types/collection';

describe('Controls/_operations/Utils/SelectionViewModeHelper', () => {

    describe('getSelectionViewMode', function () {

        describe('Плоский список', function () {
            const sourceController = {
                hasMoreData: () => false,
            };
            let selectionViewMode = 'hidden';
            const options = {
                selectedKeys: [1],
                excludedKeys: []
            };
            it('Записи загружены, есть выбранные значения', function () {
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('all');
            });

            it('Записи загружены, ничего не выбрано, кнопка Показать отмеченные не нажата', function () {
                options.selectedKeys = [];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('hidden');
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Показать отмеченные', function () {
                selectionViewMode = 'selected';
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('selected');
            });

            it('Записи не загружены, нет excludedKeys, есть выбранные значения', function () {
                selectionViewMode = 'hidden';
                options.selectedKeys = [1];
                sourceController.hasMoreData = () => true;
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('all');
            });

            it('Записи не загружены, есть excludedKeys, есть выбранные значения', function () {
                options.excludedKeys = [2];
                sourceController.hasMoreData = () => true;
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('hidden');
            });
        });

        describe('Иерархический список', function () {
            const items = new RecordSet({
                rawData: [
                    {id: 1, title: 'Parent 1', parent: null, node: true},
                    {id: 2, title: 'Child 1', parent: 1, node: false},
                    {id: 3, title: 'Parent 2', parent: null, node: true},
                    {id: 4, title: 'Child 2', parent: 3, node: true},
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
                nodeProperty: 'node'
            };

            it('Записи загружены, есть выбранные значения', function () {
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('all');
            });

            it('Записи загружены, ничего не выбрано, кнопка Показать отмеченные не нажата', function () {
                options.selectedKeys = [];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('hidden');
            });

            it('Записи загружены, ничего не выбрано, нажата кнопка Показать отмеченные', function () {
                selectionViewMode = 'selected';
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('selected');
            });

            it('Выбранная папка загружена, есть незагруженные записи, но они не выбраны', function () {
                selectionViewMode = 'hidden';
                options.selectedKeys = [1];
                sourceController.hasMoreData = (direction, key) => {
                    return key === 4;
                };
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('all');
            });

            it('Выбранная папка незагружена', function () {
                options.excludedKeys = [4];
                expect(getSelectionViewMode(selectionViewMode, options, sourceController)).toBe('hidden');
            });
        });
    });
});
