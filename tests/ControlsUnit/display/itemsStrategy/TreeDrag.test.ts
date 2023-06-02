import IItemsStrategy from 'Controls/_display/IItemsStrategy';

import { Tree, TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import * as ListData from 'ControlsUnit/ListData';
import { TreeDragStrategy as TreeDrag } from 'Controls/baseTree';

describe('Controls/baseTree:TreeDragStrategy', () => {
    function wrapItem<S extends Model = Model, T = TreeItem>(item: S): T {
        return new TreeItem({
            contents: item,
        });
    }

    function getSource<S = Model, T = TreeItem>(
        wraps: T[]
    ): IItemsStrategy<S, T> {
        const items = wraps.slice();

        return {
            '[Controls/_display/IItemsStrategy]': true,
            source: null,
            options: {
                display: null,
            },
            get count(): number {
                return items.length;
            },
            get items(): T[] {
                return items.slice();
            },
            at(index: number): T {
                return items[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: S[]): T[] {
                return items.splice(
                    start,
                    deleteCount,
                    ...added.map<T>(wrapItem)
                );
            },
            invalidate(): void {
                this.invalidated = true;
            },
            reset(): void {
                items.length = 0;
            },
        };
    }

    const items = ListData.getItems();
    const rs = new RecordSet({
        rawData: items,
        keyProperty: 'id',
    });

    let source;
    let strategy;
    let display;

    beforeEach(() => {
        display = new Tree({
            collection: rs,
            root: new Model({
                rawData: { id: null },
                keyProperty: ListData.KEY_PROPERTY,
            }),
            keyProperty: ListData.KEY_PROPERTY,
            parentProperty: ListData.PARENT_PROPERTY,
            nodeProperty: ListData.NODE_PROPERTY,
            hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
            groupProperty: 'group',
        });
        source = getSource(display.getItems());
        strategy = new TreeDrag({
            source,
            display,
            draggableItem: display.getItemBySourceKey(3),
            draggedItemsKeys: [3],
            targetIndex: 2,
        });
    });

    afterEach(() => {
        source = undefined;
        strategy = undefined;
    });

    it('setPosition', () => {
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        strategy.items;
        expect(strategy.avatarItem.getParent()).toEqual(
            display.getItemBySourceKey(2)
        );

        strategy.setPosition({
            index: 1,
            position: 'before',
            dispItem: display.getItemBySourceKey(2),
        });
        expect(strategy.avatarItem.getParent()).toEqual(
            display.getItemBySourceKey(1)
        );
    });

    it('should not change parent if position after empty expanded node', () => {
        display.setExpandedItems([null]);
        const strategy = new TreeDrag({
            source,
            display,
            draggableItem: display.getItemBySourceKey(7),
            draggedItemsKeys: [7],
            targetIndex: 6,
        });
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        strategy.items;

        strategy.setPosition({
            index: 5,
            position: 'after',
            dispItem: display.getItemBySourceKey(6),
        });

        expect(strategy.avatarItem.getParent()).toEqual(display.getRoot());
    });

    it('setPosition on group', () => {
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        strategy.items;
        strategy.setPosition({
            index: 1,
            position: 'before',
            dispItem: display.getItemBySourceKey(222),
        });
        expect(strategy.avatarItem.getParent()).toEqual(display.getRoot());
    });

    it('should be corrected parent of draggable item after hide it parent', () => {
        display.setDraggedItems(display.getItemBySourceKey(3), [2, 3, 4]);
        expect(display.getItemBySourceKey(3).getParent().key).toEqual(
            display.getItemBySourceKey(1).key
        );
    });

    it('drag without avatar item', () => {
        strategy = new TreeDrag({
            source,
            display,
            draggedItemsKeys: [1234],
            targetIndex: 0,
        });

        expect(strategy.items.length).toEqual(9);
        expect(strategy.avatarItem).toBeFalsy();
    });
});
