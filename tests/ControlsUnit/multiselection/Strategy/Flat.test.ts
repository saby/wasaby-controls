/* eslint-disable no-magic-numbers */

import { FlatSelectionStrategy } from 'Controls/multiselection';
import { RecordSet } from 'Types/collection';
import { Collection } from 'Controls/display';

describe('Controls/_multiselection/SelectionStrategy/Flat', () => {
    const items = new RecordSet({
        rawData: [{ id: 1, group: 'group-1' }, { id: 2, group: 'group-1' }, { id: 3, group: 'group-2' }],
        keyProperty: 'id',
    });

    const model = new Collection({ collection: items, keyProperty: 'id' });

    const strategy = new FlatSelectionStrategy({ model });

    describe('select', () => {
        it('not selected', () => {
            let selection = { selected: [], excluded: [] };
            selection = strategy.select(selection, 2);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all, but one', () => {
            let selection = { selected: [null], excluded: [2] };
            selection = strategy.select(selection, 2);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('unselect', () => {
        it('selected one', () => {
            let selection = { selected: [2], excluded: [] };
            selection = strategy.unselect(selection, 2);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all', () => {
            let selection = { selected: [null], excluded: [] };
            selection = strategy.unselect(selection, 2);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([2]);
        });
    });

    describe('selectAll', () => {
        it('not selected', () => {
            let selection = { selected: [], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected one', () => {
            let selection = { selected: [1], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all, but one', () => {
            let selection = { selected: [null], excluded: [2] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([]);
        });

        it('with limit', () => {
            let selection = { selected: [null], excluded: [2] };
            selection = strategy.selectAll(selection, 3);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([2]);
        });
    });

    describe('unselectAll', () => {
        it('selected one', () => {
            let selection = { selected: [1], excluded: [] };
            selection = strategy.unselectAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all, but one', () => {
            let selection = { selected: [null], excluded: [2] };
            selection = strategy.unselectAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('shouldn\'t add group keys to selection', () => {
            const modelWithGroups = new Collection({ collection: items, keyProperty: 'id', groupProperty: 'group' });
            const strategy = new FlatSelectionStrategy({ model: modelWithGroups });

            let selection = { selected: [null], excluded: [] };
            selection = strategy.unselectAll(selection, {filter: true});
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([1, 2, 3]);
        });
    });

    describe('toggleAll', () => {
        it('not selected', () => {
            let selection = { selected: [], excluded: [] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected one', () => {
            let selection = { selected: [1], excluded: [] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([1]);
        });

        it('selected all, but one', () => {
            let selection = { selected: [null], excluded: [2] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('selectRange', () => {
        it('select range', () => {
            const selection = strategy.selectRange(model.getItems());
            expect(selection.selected).toEqual([1, 2, 3]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('getSelectionForModel', () => {
        it('not selected', () => {
            const selection = { selected: [], excluded: [] };
            const res = strategy.getSelectionForModel(selection);
            expect(res.get(true)).toEqual([]);
            expect(res.get(null)).toEqual([]);
            expect(res.get(false)).toEqual([
                model.getItemBySourceKey(1),
                model.getItemBySourceKey(2),
                model.getItemBySourceKey(3),
            ]);
        });

        it('selected one', () => {
            const selection = { selected: [1], excluded: [] };
            const res = strategy.getSelectionForModel(selection);
            expect(res.get(true)).toEqual([model.getItemBySourceKey(1)]);
            expect(res.get(null)).toEqual([]);
            expect(res.get(false)).toEqual([
                model.getItemBySourceKey(2),
                model.getItemBySourceKey(3),
            ]);
        });

        it('selected all, but one', () => {
            const selection = { selected: [null], excluded: [2] };
            const res = strategy.getSelectionForModel(selection);
            expect(res.get(true)).toEqual([
                model.getItemBySourceKey(1),
                model.getItemBySourceKey(3),
            ]);
            expect(res.get(null)).toEqual([]);
            expect(res.get(false)).toEqual([model.getItemBySourceKey(2)]);
        });
    });

    describe('isAllSelected', () => {
        it('not empty model', () => {
            let selection = { selected: [null], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 3, null)).toBe(true);

            selection = { selected: [null], excluded: [5] };
            expect(strategy.isAllSelected(selection, false, 3, null)).toBe(false);

            selection = { selected: [1, 2, 3], excluded: [] };
            expect(strategy.isAllSelected(selection, true, 3, null)).toBe(false);

            selection = { selected: [1, 2, 3], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 3, null)).toBe(true);

            selection = { selected: [], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 3, null, false)).toBe(false);

            selection = { selected: [null], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 3, null, false)).toBe(true);

            selection = { selected: [null, 2], excluded: [3] };
            expect(strategy.isAllSelected(selection, false, 3, null, false)).toBe(true);
        });

        it('empty model', () => {
            const strategy = new FlatSelectionStrategy({
                model: new Collection({
                    collection: new RecordSet(),
                    keyProperty: 'id',
                }),
            });

            const selection = { selected: [], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 0, null, true)).toBe(false);
        });

        it('limit', () => {
            const selection = { selected: [null], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 3, 2, true)).toBe(false);
            expect(strategy.isAllSelected(selection, false, 3, 3, true)).toBe(true);
            expect(strategy.isAllSelected(selection, false, 3, 5, true)).toBe(true);
            expect(strategy.isAllSelected(selection, true, 3, 5, true)).toBe(false);
        });
    });
});
