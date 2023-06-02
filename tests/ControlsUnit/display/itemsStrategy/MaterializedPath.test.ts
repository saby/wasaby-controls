import {
    MaterializedPathStrategy as MaterializedPath,
    IMaterializedPathStrategyOptions as IOptions,
} from 'Controls/baseTree';

import { Tree as TreeDisplay, TreeItem } from 'Controls/baseTree';

describe('Controls/baseTree:MaterializedPath', () => {
    interface IItem {
        id: number;
        children?: IItem[];
    }

    function getOptions<S, T extends TreeItem<S>>(
        display: TreeDisplay<S, T>
    ): IOptions<S, T> {
        return {
            display,
            childrenProperty: display.getChildrenProperty(),
            root: display.getRoot.bind(display),
        };
    }

    let items: IItem[];
    let expandedItems: number[];
    let display: TreeDisplay<IItem>;
    let strategy: MaterializedPath<IItem>;

    beforeEach(() => {
        items = [
            {
                id: 1,
                children: [
                    { id: 11, children: [] },
                    {
                        id: 12,
                        children: [{ id: 121, children: [] }, { id: 122 }],
                    },
                    { id: 13, children: [] },
                ],
            },
            { id: 2, children: [{ id: 21 }, { id: 22 }] },
        ];
        expandedItems = [1, 11, 12, 121, 122, 13, 2, 21, 22];
        display = new TreeDisplay({
            collection: items,
            childrenProperty: 'children',
            keyProperty: 'id',
        });
        strategy = new MaterializedPath(getOptions(display));
    });

    afterEach(() => {
        items = undefined;
        expandedItems = undefined;
        display = undefined;
        strategy = undefined;
    });

    describe('.at()', () => {
        it('should return a CollectionItems', () => {
            expandedItems.forEach((id, index) => {
                expect(strategy.at(index)).toBeInstanceOf(TreeItem);
                expect(strategy.at(index).getContents().id).toBe(id);
            });
        });

        it('should return a CollectionItems in reverse order', () => {
            for (let index = expandedItems.length - 1; index >= 0; index--) {
                expect(strategy.at(index).getContents().id).toBe(
                    expandedItems[index]
                );
            }
        });

        it('should return the same CollectionItem twice', () => {
            expandedItems.forEach((id, index) => {
                expect(strategy.at(index)).toBe(strategy.at(index));
            });
        });

        it('should return a CollectionItems with parent', () => {
            const display = new TreeDisplay({
                collection: items,
                childrenProperty: 'children',
                root: { id: 0 },
                keyProperty: 'id',
            });
            const strategy = new MaterializedPath(getOptions(display));

            expandedItems.forEach((i, index) => {
                const item = strategy.at(index);
                const id = item.getContents().id;
                const parentId = Math.floor(id / 10);

                expect(item.getParent().getContents().id).toBe(parentId);
            });
        });
        it('should return a TreeItem as node', () => {
            const display = new TreeDisplay({
                collection: [{ id: '0', node: true }],
                nodeProperty: 'node',
                keyProperty: 'id',
            });
            const strategy = new MaterializedPath(getOptions(display));

            expect(strategy.at(0).isNode()).toBe(true);
        });

        it('should return a TreeItem as leaf', () => {
            const display = new TreeDisplay({
                collection: [{ id: '0', node: false }],
                nodeProperty: 'node',
                keyProperty: 'id',
            });
            const strategy = new MaterializedPath(getOptions(display));

            expect(strategy.at(0).isNode()).toBe(false);
        });

        it('should return a TreeItem with children', () => {
            const display = new TreeDisplay({
                collection: [{ id: '0', hasChildren: true }],
                hasChildrenProperty: 'hasChildren',
                keyProperty: 'id',
            });
            const strategy = new MaterializedPath(getOptions(display));

            expect(strategy.at(0).hasChildren()).toBe(true);
        });

        it('should return a TreeItem without children', () => {
            const display = new TreeDisplay({
                collection: [{ id: '0', hasChildren: false }],
                hasChildrenProperty: 'hasChildren',
                keyProperty: 'id',
            });
            const strategy = new MaterializedPath(getOptions(display));

            expect(strategy.at(0).hasChildren()).toBe(false);
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toBe(expandedItems.length);
        });
    });

    describe('.items', () => {
        it('should return an items', () => {
            expect(strategy.items.length).toBe(expandedItems.length);
            expandedItems.forEach((id, index) => {
                expect(strategy.items[index].getContents().id).toBe(
                    expandedItems[index]
                );
            });
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const item = { id: 10, children: [{ id: 100 }, { id: 101 }] };
            items[0].children.unshift(item);
            expandedItems.splice(1, 0, 10, 100, 101);
            strategy.splice(0, 0, [item]);

            expect(strategy.items.length).toBe(expandedItems.length);
            expandedItems.forEach((id, index) => {
                expect(strategy.at(index).getContents().id).toBe(id);
            });
        });

        it('should remove items', () => {
            items.splice(0, 1);
            expandedItems.splice(0, 6);
            strategy.splice(0, 1);

            expect(strategy.items.length).toBe(expandedItems.length);
            expandedItems.forEach((id, index) => {
                expect(strategy.at(index).getContents().id).toBe(id);
            });
        });
    });

    describe('.reset()', () => {
        it('should re-create items', () => {
            const prevItems = [];
            expandedItems.forEach((id, index) => {
                prevItems.push(strategy.at(index));
            });

            strategy.reset();
            expandedItems.forEach((id, index) => {
                expect(strategy.at(index)).not.toBe(prevItems[index]);
            });
        });
    });

    describe('.getSorters()', () => {
        it('should append a "tree" sorter', () => {
            const sorters = strategy.getSorters();
            expect(sorters[sorters.length - 1].name).toBe('tree');
        });

        it('should set the sorter options', () => {
            const sorters = strategy.getSorters();
            expect(typeof sorters[0].options).toBe('function');
            expect(Array.isArray(sorters[0].options().indexToPath)).toBe(true);
        });
    });

    describe('.sortItems()', () => {
        it('should expand all of the direct branches to the array', () => {
            // [0, 1, 2, 3, 4, 5, 6, 7, 8]
            const current = expandedItems.map((it, i) => {
                return i;
            });
            const sorter = strategy.getSorters().pop();
            const options = {
                indexToPath: sorter.options().indexToPath,
            };
            const expected = [1, 11, 12, 121, 122, 13, 2, 21, 22];

            const items = strategy.items;
            const sorted = MaterializedPath.sortItems(items, current, options);
            const result = sorted.map((index) => {
                return items[index].getContents().id;
            });

            expect(result).toEqual(expected);
        });

        it('should expand all of the reversed branches to the array', () => {
            // [8, 7, 6, 5, 4, 3, 2, 1, 0]
            const current = expandedItems
                .map((it, i) => {
                    return i;
                })
                .reverse();
            const sorter = strategy.getSorters().pop();
            const options = {
                indexToPath: sorter.options().indexToPath,
            };
            // [1, 11, 12, 121, 122, 13, 2, 21, 22] => [2, 22, 21, 1, 13, 12, 122, 121, 11]
            const expected = [2, 22, 21, 1, 13, 12, 122, 121, 11];

            const items = strategy.items;
            const sorted = MaterializedPath.sortItems(items, current, options);
            const result = sorted.map((index) => {
                return items[index].getContents().id;
            });

            expect(result).toEqual(expected);
        });
    });
});
