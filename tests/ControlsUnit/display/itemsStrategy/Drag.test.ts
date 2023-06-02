import IItemsStrategy from 'Controls/_display/IItemsStrategy';

import {
    Collection,
    Collection as CollectionDisplay,
    CollectionItem,
} from 'Controls/display';
import { Tree } from 'Controls/baseTree';
import Drag from 'Controls/_display/itemsStrategy/Drag';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import Direct from 'Controls/_display/itemsStrategy/Direct';
import { AdjacencyList } from 'Controls/baseTree';

describe('Controls/_display/itemsStrategy/Drag', () => {
    function wrapItem<S extends Model = Model, T = CollectionItem>(item: S): T {
        return new CollectionItem({
            contents: item,
        });
    }

    function getSource<S = Model, T = CollectionItem>(
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

    const items = [
        { id: 1, name: 'Ivan' },
        { id: 2, name: 'Alexey' },
        { id: 3, name: 'Olga' },
    ];
    let rs;
    let source;
    let strategy;
    let display;

    beforeEach(() => {
        rs = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });
        display = new CollectionDisplay({
            collection: rs,
        });
        source = getSource(display.getItems());
        strategy = new Drag({
            source,
            display,
            draggableItem: display.getItemBySourceKey(1),
            draggedItemsKeys: [1],
            targetIndex: 0,
        });
    });

    afterEach(() => {
        source = undefined;
        strategy = undefined;
    });

    it('.options', () => {
        const options = strategy.options;

        expect(options.source).toEqual(source);
        expect(options.display).toEqual(display);
        expect(options.draggableItem).toEqual(display.getItemBySourceKey(1));
        expect(options.draggedItemsKeys).toEqual([1]);
        expect(options.targetIndex).toEqual(0);
    });

    it('.source', () => {
        expect(strategy.source).toEqual(source);
    });

    describe('.getDisplayIndex', () => {
        it('default', () => {
            expect(strategy.getDisplayIndex(1)).toEqual(1);
        });

        it('drag some items', () => {
            display = new Tree({
                collection: new RecordSet({
                    rawData: [
                        { id: 1, node: null, parent: null },
                        { id: 2, node: null, parent: null },
                        { id: 3, node: true, parent: null },
                        { id: 31, node: null, parent: 3 },
                    ],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                nodeProperty: 'node',
                parentProperty: 'parent',
                root: null,
                expandedItems: [3],
            });
            display.setDraggedItems(display.getItemBySourceKey(2), [1, 2]);

            expect(display.getIndexBySourceIndex(2)).toEqual(1);
        });

        it('drag some items separately', () => {
            display = new Tree({
                collection: new RecordSet({
                    rawData: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                        { id: 5 },
                        { id: 6 },
                    ],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
            });
            display.setDraggedItems(display.getItemBySourceKey(3), [2, 3, 5]);

            expect(display.getIndexBySourceIndex(1)).toEqual(-1);
            expect(display.getIndexBySourceIndex(2)).toEqual(1);
            expect(display.getIndexBySourceIndex(3)).toEqual(2);
            expect(display.getIndexBySourceIndex(5)).toEqual(3);
        });
    });

    it('.getCollectionIndex', () => {
        expect(strategy.getCollectionIndex(1)).toEqual(1);
    });

    it('.count', () => {
        expect(strategy.count).toEqual(3);
    });

    it('.at', () => {
        expect(strategy.at(0).getContents()).toEqual(
            display.getItemBySourceKey(1).getContents()
        );
    });

    describe('items', () => {
        it('default', () => {
            const items = strategy.items;
            expect(items[0].getContents()).toEqual(
                display.getItemBySourceKey(1).getContents()
            );
            expect(items[1].getContents()).toEqual(
                display.getItemBySourceKey(2).getContents()
            );
            expect(items[2].getContents()).toEqual(
                display.getItemBySourceKey(3).getContents()
            );
        });

        it('drag some items separately', () => {
            display = new Tree({
                collection: new RecordSet({
                    rawData: [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                        { id: 5 },
                        { id: 6 },
                    ],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
            });
            source = getSource(display.getItems());
            display.setDraggedItems(display.getItemBySourceKey(2), [2, 3, 5]);

            const keys = [];
            display.each((it) => {
                return keys.push(it.getContents().getKey());
            });
            expect(keys).toEqual([1, 2, 4, 6]);
        });

        it('collection has filtered items', () => {
            display = new Collection({
                collection: new RecordSet({
                    rawData: [
                        { id: 0 },
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                        { id: 5 },
                    ],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                filter: (item, index) => {
                    return index % 2 === 0;
                }, // скрыты все нечетные записи
            });
            source = getSource(display.getItems());
            strategy = new Drag({
                source,
                display,
                draggableItem: display.getItemBySourceKey(2),
                draggedItemsKeys: [2],
                targetIndex: 1,
            });

            let keys = [];
            display.each((it) => {
                return keys.push(it.getContents().getKey());
            });
            expect(keys).toEqual([0, 2, 4]);

            strategy.setPosition({ index: 2, position: 'after' });
            keys = [];
            display.each((it) => {
                return keys.push(it.getContents().getKey());
            });
            expect(keys).toEqual([0, 2, 4]);

            strategy.setPosition({ index: 1, position: 'before' });
            keys = [];
            display.each((it) => {
                return keys.push(it.getContents().getKey());
            });
            expect(keys).toEqual([0, 2, 4]);
        });
    });

    it('setPosition', () => {
        // move down
        strategy.setPosition({
            index: 1,
            position: 'after',
            dispItem: display.getItemBySourceKey(2),
        });
        let items = strategy.items;
        expect(items[0].getContents()).toEqual(
            display.getItemBySourceKey(2).getContents()
        );
        expect(items[1].getContents()).toEqual(
            display.getItemBySourceKey(1).getContents()
        );
        expect(items[2].getContents()).toEqual(
            display.getItemBySourceKey(3).getContents()
        );

        // move up
        strategy.setPosition({
            index: 0,
            position: 'before',
            dispItem: display.getItemBySourceKey(1),
        });
        items = strategy.items;
        expect(items[0].getContents()).toEqual(
            display.getItemBySourceKey(1).getContents()
        );
        expect(items[1].getContents()).toEqual(
            display.getItemBySourceKey(2).getContents()
        );
        expect(items[2].getContents()).toEqual(
            display.getItemBySourceKey(3).getContents()
        );
    });

    it('.avatarItem', () => {
        expect(strategy.avatarItem).toBeFalsy();
        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        strategy.items;
        expect(strategy.avatarItem.getContents()).toEqual(
            display.getItemBySourceKey(1).getContents()
        );
    });

    it('drag several items', () => {
        display.setDraggedItems(display.getItemBySourceKey(1), [1, 2]);

        const keys = [];
        display.each((it) => {
            return keys.push(it.getContents().getKey());
        });
        expect(keys.length).toEqual(2);
        expect(display.at(0).key).toEqual(1);
        expect(display.at(1).key).toEqual(3);
    });

    it('splice', () => {
        strategy.splice(0, 1, []);
        expect(strategy._items).toBeNull();
        expect(strategy.count).toEqual(2);
    });

    it('drag all items', () => {
        display.setDraggedItems(display.getItemBySourceKey(1), [1, 2, 3]);

        const keys = [];
        display.each((it) => {
            return keys.push(it.getContents().getKey());
        });
        expect(keys.length).toEqual(1);
    });

    it('remove item when drag', () => {
        strategy = new Drag({
            source,
            display,
            draggableItem: display.getItemBySourceKey(3),
            draggedItemsKeys: [3],
            targetIndex: 2,
        });

        let items = strategy.items;
        expect(items.length).toEqual(3);

        strategy.splice(1, 1, [], 'rm');
        strategy.invalidate();
        items = strategy.items;
        expect(items.length).toEqual(2);
    });

    it('test drag strategy with adjacency strategy', () => {
        const recordSet = new RecordSet({
            rawData: [
                {
                    id: 1,
                    parent: null,
                    node: true,
                },
                {
                    id: 2,
                    parent: 1,
                    node: false,
                },
                {
                    id: 3,
                    parent: null,
                    node: true,
                },
            ],
            keyProperty: 'id',
        });
        const tree = new Tree({
            collection: recordSet,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
        });
        const directStrategy = new Direct({
            display: tree,
        });
        const adjacencyListStrategy = new AdjacencyList({
            source: directStrategy,
            keyProperty: 'id',
            parentProperty: 'parent',
        });
        const dragStrategy = new Drag({
            source: adjacencyListStrategy,
            display,
            draggableItem: display.getItemBySourceKey(1),
            draggedItemsKeys: [1],
            targetIndex: 0,
        });

        const newItem = new Model({
            rawData: { id: 4, parent: 1, node: false },
            keyProperty: 'id',
        });
        dragStrategy.splice(2, 0, [newItem]);

        const adjacencyKeys = adjacencyListStrategy.items.map((it) => {
            return it.key;
        });
        const dragKeys = dragStrategy.items.map((it) => {
            return it.key;
        });

        expect(adjacencyKeys).toEqual(dragKeys);
    });

    it('drag without avatar item', () => {
        strategy = new Drag({
            source,
            display,
            draggedItemsKeys: [1234],
            targetIndex: 0,
        });

        expect(strategy.items.length).toEqual(3);
        expect(strategy.avatarItem).toBeFalsy();
    });

    it('drag some last items', () => {
        display.setDraggedItems(display.getItemBySourceKey(3), [2, 3]);

        const keys = [];
        display.each((it) => {
            return keys.push(it.getContents().getKey());
        });
        expect(keys.length).toEqual(2);
    });
});
