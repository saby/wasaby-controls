import { ConsoleLogger } from 'Env/Env';

import IItemsStrategy, { IOptions } from 'Controls/_display/IItemsStrategy';
import { AdjacencyList, TreeItem } from 'Controls/baseTree';

import { CollectionItem, GroupItem } from 'Controls/display';

describe('Controls/baseTree:AdjacencyList', () => {
    afterEach(() => {
        jest.useRealTimers();
    });
    function getDisplay(root: number | object): object {
        return {
            getRoot(): TreeItem<number | object> {
                return (
                    this.root ||
                    (this.root = new TreeItem({
                        contents: root,
                    }))
                );
            },

            createItem(options: any): TreeItem<number | object> {
                options.node = options.contents.node;
                options.hasChildren = options.contents.hasChildren;
                return new TreeItem(options);
            },
        };
    }

    function wrapItem<S, T>(item: S): T {
        if (item instanceof CollectionItem) {
            return item as any as T;
        }
        return new TreeItem({
            contents: item,
        }) as any as T;
    }

    function getSource<S, T = TreeItem<S>>(
        items: S[],
        root?: number | object
    ): IItemsStrategy<S, T> {
        const display = getDisplay(root);

        const options = {
            display,
            items,
        };

        const wraps = items.map<T>(wrapItem);

        return {
            '[Controls/_display/IItemsStrategy]': true,
            source: null,
            get options(): IOptions<S, T> {
                return options as any;
            },
            get count(): number {
                return wraps.length;
            },
            get items(): T[] {
                return wraps.slice();
            },
            at(index: number): T {
                return wraps[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: S[]): T[] {
                items.splice(start, deleteCount, ...added);
                return wraps.splice(
                    start,
                    deleteCount,
                    ...added.map<T>(wrapItem)
                );
            },
            invalidate(): void {
                this.invalidated = true;
            },
            reset(): void {
                wraps.length = 0;
                items.length = 0;
            },
        };
    }

    describe('.items', () => {
        it('should return items translated from source items contents', () => {
            const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            strategy.items.forEach((item, index) => {
                expect(item.getContents()).toBe(items[index]);
            });

            expect(strategy.items.length).toBe(items.length);
        });

        it('should return unique children instances with the same contents for repeat nodes', () => {
            const rootNode1 = { id: 1, pid: null };
            const rootNode2 = { id: 2, pid: null };
            const innerNode = { id: 3, pid: rootNode1.id };
            const innerNodeDuplicate = { id: 3, pid: rootNode2.id };
            const leaf1 = { id: 21, pid: innerNode.id };
            const leaf2 = { id: 32, pid: innerNode.id };
            const items = [
                rootNode1,
                rootNode2,
                innerNode,
                innerNodeDuplicate,
                leaf1,
                leaf2,
            ];
            const source = getSource(items, null);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            const treeItems = strategy.items;
            const expectedContents = [
                rootNode1,
                innerNode,
                leaf1,
                leaf2,
                rootNode2,
                innerNodeDuplicate,
                leaf1,
                leaf2,
            ];

            treeItems.forEach((item, index) => {
                expect(item.getContents()).toBe(expectedContents[index]);
                expect(treeItems.indexOf(item)).toBe(index);
            });
            expect(treeItems.length).toBe(expectedContents.length);
        });

        it('should keep groups order', () => {
            const items = [
                new GroupItem({ contents: 'a' }),
                { id: 1 },
                new GroupItem({ contents: 'b' }),
                { id: 2 },
                { id: 3 },
            ];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expectedInstances = [
                GroupItem,
                TreeItem,
                GroupItem,
                TreeItem,
                TreeItem,
            ];
            const expectedContents = ['a', items[1], 'b', items[3], items[4]];

            strategy.items.forEach((item, index) => {
                expect(item).toBeInstanceOf(expectedInstances[index]);
                expect(item.getContents()).toBe(expectedContents[index]);
            });

            expect(strategy.items.length).toBe(expectedInstances.length);
        });

        it('should keep groups order on several tree levels', () => {
            const items = [
                new GroupItem({ contents: 'a' }),
                { id: 11, pid: 1 },
                { id: 1, pid: 0 },
                new GroupItem({ contents: 'b' }),
                { id: 2, pid: 0 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = ['a', items[2], items[1], 'b', items[4]];

            strategy.items.forEach((item, index) => {
                expect(item.getContents()).toBe(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it("should revert parents's group if any child join another group", () => {
            const items = [
                new GroupItem({ contents: 'a' }),
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                new GroupItem({ contents: 'b' }),
                { id: 11, pid: 1 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = ['a', items[1], 'b', items[4], 'a', items[2]];

            strategy.items.forEach((item, index) => {
                expect(item.getContents()).toBe(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it(
            "shouldn't revert parents's group if any child joins another group but next parent's sibling has his" +
                ' own group',
            () => {
                const items = [
                    new GroupItem({ contents: 'a' }),
                    { id: 1, pid: 0 },
                    new GroupItem({ contents: 'c' }),
                    { id: 2, pid: 0 },
                    new GroupItem({ contents: 'b' }),
                    { id: 11, pid: 1 },
                ];
                const source = getSource(items, 0);
                const strategy = new AdjacencyList({
                    source,
                    keyProperty: 'id',
                    parentProperty: 'pid',
                });
                const expected = ['a', items[1], 'b', items[5], 'c', items[3]];

                strategy.items.forEach((item, index) => {
                    expect(item.getContents()).toBe(expected[index]);
                });

                expect(strategy.items.length).toBe(expected.length);
            }
        );

        it("should set valid parent if node joins another group then it's previous sibling", () => {
            const items = [
                new GroupItem({ contents: 'a' }),
                { id: 1 },
                new GroupItem({ contents: 'b' }),
                { id: 2 },
                new GroupItem({ contents: 'aa' }),
                { id: 11, pid: 1 },
                new GroupItem({ contents: 'bb' }),
                { id: 22, pid: 2 },
            ];
            const source = getSource(items);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            const givenA = strategy.items.map((item) => {
                return item.getContents();
            });
            expect(givenA).toEqual([
                'a',
                items[1],
                'aa',
                items[5],
                'b',
                items[3],
                'bb',
                items[7],
            ]);

            const givenB = strategy.items.map((item) => {
                return item['[Controls/_display/GroupItem]']
                    ? item.getContents()
                    : item.getParent().getContents();
            });
            expect(givenB).toEqual([
                'a',
                undefined,
                'aa',
                items[1],
                'b',
                undefined,
                'bb',
                items[3],
            ]);
        });
    });

    describe('.at()', () => {
        let items: { id: number; pid: number }[];
        let source;
        let strategy;

        beforeEach(() => {
            items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 4, pid: 0 },
                { id: 11, pid: 1 },
                { id: 31, pid: 3 },
                { id: 21, pid: 2 },
                { id: 41, pid: 4 },
                { id: 111, pid: 11 },
            ];
            source = getSource(items, 0);
            strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
        });

        afterEach(() => {
            items = undefined;
            strategy = undefined;
        });

        it('should return items in hierarchical order for root as Number', () => {
            const expected = [1, 11, 111, 2, 21, 3, 31, 4, 41];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should return items in hierarchical order for root as object', () => {
            const root = { id: 0 };
            const source = getSource(items, root);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [1, 11, 111, 2, 21, 3, 31, 4, 41];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should return items in hierarchical order for root as null', () => {
            const rootId = null;
            const items = [
                { id: 1, pid: rootId },
                { id: 2, pid: rootId },
                { id: 11, pid: 1 },
                { id: 21, pid: 2 },
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [1, 11, 2, 21];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should return items in hierarchical order for root as null and children related to undefined', () => {
            const rootId = null;
            const items = [
                { id: 1 },
                { id: 2 },
                { id: 11, pid: 1 },
                { id: 21, pid: 2 },
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [items[0], items[2], items[1], items[3]];
            const expectedParent = [rootId, items[0], rootId, items[1]];

            for (let index = 0; index < expected.length; index++) {
                const item = strategy.at(index);
                expect(item.getContents()).toBe(expected[index]);
                expect(item.getParent().getContents()).toBe(
                    expectedParent[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should return items in hierarchical order for specified root', () => {
            const rootId = 1;
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [11, 111];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should lookup for const ious value types to root', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: '0' },
                { id: 11, pid: 1 },
                { id: 12, pid: '1' },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [1, 11, 12, 2];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should work with scalar root wrapped using Object', () => {
            // eslint-disable-next-line no-new-wrappers
            const root = new Number(0);
            const items = [
                { id: 11, pid: 1 },
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 21, pid: 2 },
            ];
            const source = getSource(items, root);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [1, 11, 2, 21];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should return only root items if keyProperty is not injected', () => {
            const source = getSource(items, 0);
            jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation();
            // ворнинг кидается через таймаут, поэтому будем ловить его так, чтобы после теста ничего не зависало
            jest.useFakeTimers();
            const strategy = new AdjacencyList({
                source,
                parentProperty: 'pid',
            });
            jest.runAllTimers();
            expect(ConsoleLogger.prototype.warn).toHaveBeenCalledWith(
                'Warning',
                'Controls/baseTree:AdjacencyList::constructor(): option "keyProperty" is not defined.' +
                    ' Only root elements will be presented'
            );
            const expected = [1, 2, 3, 4];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(strategy.count).toBe(expected.length);
            expect(ConsoleLogger.prototype.warn).toHaveBeenCalledTimes(1);
        });

        it('should return different TreeItem instances for repeats and duplicates', () => {
            const rootId = 0;
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 11, pid: 1 },
                { id: 111, pid: 11 },
                { id: 11, pid: 2 },
            ];
            const source = getSource(items, rootId);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [1, 11, 111, 2, 11, 111];
            const treeItems = [];

            for (let index = 0; index < expected.length; index++) {
                const treeItem = strategy.at(index);
                expect(treeItems.indexOf(treeItem)).toEqual(-1);
                treeItems.push(treeItem);

                expect(treeItem.getContents().id).toBe(expected[index]);
            }

            expect(strategy.count).toBe(expected.length);
        });

        it('should throw an Error if index is out of bounds', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            expect(() => {
                strategy.at(99);
            }).toThrow();
        });

        it('should return a TreeItem as node', () => {
            const items = [{ id: '0', node: true }];
            const source = getSource(items);
            const strategy = new AdjacencyList({ source, keyProperty: 'id' });

            expect(strategy.at(0).getContents().node).toBe(true);
        });

        it('should return a TreeItem as leaf', () => {
            const items = [{ id: '0', node: false }];
            const source = getSource(items);
            const strategy = new AdjacencyList({ source, keyProperty: 'id' });

            expect(strategy.at(0).getContents().node).toBe(false);
        });

        it('should return a TreeItem with children', () => {
            const items = [{ id: '0', hasChildren: true }];
            const source = getSource(items);
            const strategy = new AdjacencyList({ source, keyProperty: 'id' });

            expect(strategy.at(0).getContents().hasChildren).toBe(true);
        });

        it('should return a TreeItem without children', () => {
            const items = [{ id: '0', hasChildren: false }];
            const source = getSource(items);
            const strategy = new AdjacencyList({ source, keyProperty: 'id' });

            expect(strategy.at(0).getContents().hasChildren).toBe(false);
        });
    });

    describe('.count', () => {
        let items: { id: number; pid: number }[];
        let source;

        beforeEach(() => {
            items = [
                { id: 1, pid: 0 },
                { id: 3, pid: 0 },
                { id: 11, pid: 1 },
                { id: 21, pid: 2 },
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid items count', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            expect(strategy.count).toBe(3);
        });

        it('should return valid items count if keyProperty is not injected', () => {
            jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation();
            // ворнинг кидается через таймаут, поэтому будем ловить его так, чтобы после теста ничего не зависало
            jest.useFakeTimers();
            const strategy = new AdjacencyList({
                source,
                parentProperty: 'pid',
            });
            jest.runAllTimers();
            expect(ConsoleLogger.prototype.warn).toHaveBeenCalledWith(
                'Warning',
                'Controls/baseTree:AdjacencyList::constructor(): option "keyProperty" is not defined.' +
                    ' Only root elements will be presented'
            );

            expect(strategy.count).toBe(2);
            expect(ConsoleLogger.prototype.warn).toHaveBeenCalledTimes(1);
        });

        it('should return 0 if parentProperty is not injected', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
            });

            expect(strategy.count).toBe(0);
        });
    });

    describe('.splice()', () => {
        let items: { id: number; pid: number }[];

        beforeEach(() => {
            items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 21, pid: 2 },
            ];
        });

        afterEach(() => {
            items = undefined;
        });

        it('should insert an item in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const newItem = { id: 11, pid: 1 };
            const position = 3;
            const expected = [1, 11, 2, 21, 3];
            const result = strategy.splice(position, 0, [newItem]);

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(result.length).toBe(0);

            expect(strategy.count).toBe(expected.length);
        });

        it('should add items in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const newItems = [
                { id: 11, pid: 1 },
                { id: 12, pid: 1 },
                { id: 22, pid: 2 },
                { id: 4, pid: 0 },
            ];
            const itemsCount = items.length;
            const expected = [1, 11, 12, 2, 21, 22, 3, 4];
            const result = strategy.splice(itemsCount, 0, newItems);

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(result.length).toBe(0);

            expect(strategy.count).toBe(expected.length);
        });

        it('should keep old instances after inserting an item in clone', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const newItem = { id: 11, pid: 1 };
            const position = 1;
            const expected = [...strategy.items];

            // Reset _sourceItems by cloning
            const strategyClone = (AdjacencyList as any).fromJSON(
                strategy.toJSON()
            );

            strategyClone.splice(position, 0, [newItem]);
            expected.splice(position, 0, strategyClone.at(position));

            const result = strategyClone.items;
            expected.forEach((item, index) => {
                expect(item).toBe(result[index]);
            });
            expect(result.length).toEqual(expected.length);
        });

        it('should push item after latest source item', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 31, pid: 3 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const newItem = { id: 4, pid: 0 };

            strategy.splice(items.length, 0, [newItem]);

            expect(items[items.length - 1]).toBe(newItem);
        });

        it('should add items duplicates in valid order', () => {
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const newItems = [{ id: 2, pid: 0 }];
            const itemsCount = items.length;
            const expected = [1, 2, 21, 3, 2, 21];
            const displayItems = [];

            const result = strategy.splice(itemsCount, 0, newItems);

            for (let index = 0; index < expected.length; index++) {
                const item = strategy.at(index);
                expect(item.getContents().id).toBe(expected[index]);

                expect(displayItems.indexOf(item)).toEqual(-1);
                displayItems.push(item);
            }

            expect(result.length).toBe(0);

            expect(strategy.count).toBe(expected.length);
        });

        it('should remove items in valid order', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 21, pid: 2 },
                { id: 211, pid: 21 },
                { id: 22, pid: 2 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const displayAt = 2;
            const removeAt = 3;
            const expected = [1, 2, 22, 3];

            // Force create item
            expect(strategy.at(displayAt).getContents().id).toBe(21);

            const result = strategy.splice(removeAt, 1, []);

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(result.length).toBe(1);
            expect(result[0].getContents().id).toBe(21);

            expect(strategy.count).toBe(expected.length);
        });

        it('should return removed items', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 4, pid: 0 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            const expected = [strategy.at(1), strategy.at(2)];
            const result = strategy.splice(1, 2, []);

            /*
            TODO: У result есть поле hasBeenRemoved = true, т.е. это несколько модифицированный массив.
            deepEqual из chai работал не очень хорошо и не видел этой разницы, а вот toEqual из jest поймал.
            slice по сути срезает это поле, чтобы сохранить совместимость.
             */
            expect(result.slice()).toEqual(expected);
        });

        it("should return undefined for item that's not created yet", () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            const result = strategy.splice(0, 1, []);

            expect(result.length).toEqual(1);
            expect(result[0]).not.toBeDefined();
        });

        it('should remove duplicates in valid order', () => {
            const items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 2, pid: 0 },
                { id: 21, pid: 2 },
            ];
            const source = getSource(items, 0);
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const removeAt = 1;
            const expected = [1, 3, 2, 21];

            // Force create item
            expect(strategy.at(removeAt).getContents().id).toBe(2);

            const result = strategy.splice(removeAt, 1, []);

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.at(index).getContents().id).toBe(
                    expected[index]
                );
            }

            expect(result.length).toBe(1);
            expect(result[0].getContents().id).toBe(2);

            expect(strategy.count).toBe(expected.length);
        });
    });

    describe('.invalidate', () => {
        let items;
        let source;

        beforeEach(() => {
            items = [];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should call source method', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            expect(source.invalidated).not.toBeDefined();
            strategy.invalidate();
            expect(source.invalidated).toBe(true);
        });

        it('should change items order and revert it back', () => {
            const items = [
                { id: 1 },
                { id: 2 },
                { id: 11, pid: 1 },
                { id: 22, pid: 2 },
            ];
            const sourceA = getSource(items);
            const strategy = new AdjacencyList({
                source: sourceA,
                keyProperty: 'id',
                parentProperty: 'pid',
            });

            const givenA = strategy.items.map((item) => {
                return item.getContents().id;
            });
            const expectedA = [1, 11, 2, 22];
            expect(givenA).toEqual(expectedA);

            const affectedItemsB = [items[1], items[3], items[0]];
            const sourceB = getSource(affectedItemsB);
            strategy['_opt' + 'ions'].source = sourceB;
            strategy.invalidate();
            const givenB = strategy.items.map((item) => {
                return item.getContents().id;
            });
            const expectedB = [2, 22, 1];
            expect(givenB).toEqual(expectedB);

            const affectedItemsC = items;
            const sourceC = getSource(affectedItemsC);
            strategy['_opt' + 'ions'].source = sourceC;
            strategy.invalidate();
            const givenC = strategy.items.map((item) => {
                return item.getContents().id;
            });
            const expectedC = [1, 11, 2, 22];
            expect(givenC).toEqual(expectedC);
        });
    });

    describe('.getDisplayIndex()', () => {
        let items: { id: number; pid: number }[];
        let source;

        beforeEach(() => {
            items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 11, pid: 1 },
                { id: 21, pid: 2 },
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid item index', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [0, 2, 4, 1, 3];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.getDisplayIndex(index)).toBe(expected[index]);
            }
        });

        it('should return index witch source index consideration', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [2, 4, 1, 3];

            source.getDisplayIndex = (index) => {
                return index + 1;
            };

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.getDisplayIndex(index)).toBe(expected[index]);
            }
        });
    });

    describe('.getCollectionIndex()', () => {
        let items: { id: number; pid: number }[];
        let source;

        beforeEach(() => {
            items = [
                { id: 1, pid: 0 },
                { id: 2, pid: 0 },
                { id: 3, pid: 0 },
                { id: 11, pid: 1 },
                { id: 21, pid: 2 },
            ];
            source = getSource(items, 0);
        });

        afterEach(() => {
            items = undefined;
            source = undefined;
        });

        it('should return valid display index', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [0, 3, 1, 4, 2];

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.getCollectionIndex(index)).toBe(
                    expected[index]
                );
            }
        });

        it('should return index witch source index consideration', () => {
            const strategy = new AdjacencyList({
                source,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            const expected = [3, 1, 4, 2];

            source.getCollectionIndex = (index) => {
                return index + 1;
            };

            for (let index = 0; index < expected.length; index++) {
                expect(strategy.getCollectionIndex(index)).toBe(
                    expected[index]
                );
            }
        });
    });
});
