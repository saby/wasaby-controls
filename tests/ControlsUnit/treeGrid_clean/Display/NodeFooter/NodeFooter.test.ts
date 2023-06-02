import IItemsStrategy from 'Controls/_display/IItemsStrategy';

import { Model } from 'Types/entity';
import { TreeItem } from 'Controls/baseTree';
import { NodeFooterStrategy as NodeFooter } from 'Controls/baseTree';
import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';

describe('Controls/_display/itemsStrategy/NodeFooter', () => {
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
            splice(start: number, deleteCount: number, added?: T[]): T[] {
                return items.splice(start, deleteCount, ...added);
            },
            invalidate(): void {
                this.invalidated = true;
            },
            reset: jest.fn(),
        };
    }

    const recordSet = new RecordSet({
        rawData: [
            { key: 1, parent: null, type: true },
            { key: 2, parent: 1, type: true },
            { key: 3, parent: 2, type: null },
        ],
        keyProperty: 'key',
    });

    let source;
    let strategy;
    let tree;

    beforeEach(() => {
        tree = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [null],
            nodeFooterTemplate: () => {
                return '';
            },
        });
        // Нужны только триИтемы
        const items = tree.getItems().filter((it) => {
            return !it['[Controls/treeGrid:TreeGridNodeFooterRow]'];
        });
        source = getSource(items);
        strategy = new NodeFooter({
            display: tree,
            source,
            extraItemVisibilityCallback: () => {
                return true;
            },
            extraItemModule: 'Controls/treeGrid:TreeGridNodeFooterRow',
        });
    });

    afterEach(() => {
        source = undefined;
        strategy = undefined;
    });

    it('items', () => {
        const items = strategy.items;
        expect(items[3].getContents()).toEqual('node-footer-2');
        expect(items[4].getContents()).toEqual('node-footer-1');
    });

    describe('splice', () => {
        it('add items', () => {
            const newItem = tree.createItem({
                contents: new Model({
                    rawData: { key: 4, parent: null, type: true },
                    keyProperty: 'key',
                }),
            });
            strategy.splice(0, 0, [newItem]);

            const items = strategy.items;
            expect(items[1].getContents()).toEqual('node-footer-4');
        });

        it('remove items', () => {
            const removedItem = strategy.splice(1, 1, []);
            expect(removedItem[0].getContents().getKey()).toEqual(2);
            const items = strategy.items;
            // Проверяем что вместе с узлом удалился и его футер
            const removedFooter = items.find((it) => {
                return it.getContents() === 'node-footer-2';
            });
            expect(removedFooter).toBeFalsy();
        });
    });
});
