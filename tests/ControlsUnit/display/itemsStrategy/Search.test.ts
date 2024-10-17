import { IItemsStrategy } from 'Controls/display';
import {
    Search as SearchCollection,
    SearchStrategy,
    TreeItem,
    BreadcrumbsItem,
} from 'Controls/baseTree';
import { RecordSet } from 'Types/collection';

// Данные

/* В виде иерархии
    A
    AA
       AAA
          AAAa
          AAAb
       AAB
       AAC
          AAACa
       AAD
    B
    C
    d
    e
 */

/* В виде поиска
    [A]
    [A, AA, AAA]
      AAAa
      AAAb
    [A, AA, AAB]
    [A, AA, AAC]
      AACa
    [A, AA, AAD]
    [B]
    [C]
    d
    e
 */

describe('Controls/_display/itemsStrategy/Search', () => {
    class StringContents {
        constructor(props: object, protected _prop: string = 'id') {
            Object.assign(this, props);
        }

        toString(): string {
            return this[this._prop];
        }
    }

    function getSource<T>(items: T[], options: object = {}): IItemsStrategy<T, T> {
        return {
            '[Controls/_display/IItemsStrategy]': true,
            options,
            source: null,
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
            splice(start: number, deleteCount: number, added?: any[]): T[] {
                return items.splice(start, deleteCount, ...added);
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
            },
        };
    }

    function stringifyResult(contents) {
        let result: string;
        if (contents instanceof Array) {
            result = `#${contents
                .map((it) => {
                    return it.id;
                })
                .join(',')}`;
        } else {
            result = contents instanceof Object ? contents.id : contents;
        }
        return result;
    }

    let items: TreeItem<string>[];
    let source: IItemsStrategy<any, TreeItem<string>>;
    let strategy: SearchStrategy<string>;
    const display: SearchCollection = new SearchCollection({
        collection: new RecordSet({}),
        root: null,
        keyProperty: 'contents',
    });

    beforeEach(() => {
        items = [];
        items[0] = new TreeItem({
            nodeProperty: 'node',
            parent: display.getRoot(),
            contents: { id: 'A', node: true },
        });
        items[1] = new TreeItem({
            nodeProperty: 'node',
            parent: items[0],
            contents: { id: 'AA', node: true },
        });
        items[2] = new TreeItem({
            nodeProperty: 'node',
            parent: items[1],
            contents: { id: 'AAA', node: true },
        });
        items[3] = new TreeItem({
            nodeProperty: 'node',
            parent: items[2],
            contents: { id: 'AAAa' },
        });
        items[4] = new TreeItem({
            nodeProperty: 'node',
            parent: items[2],
            contents: { id: 'AAAb' },
        });
        items[5] = new TreeItem({
            nodeProperty: 'node',
            parent: items[1],
            contents: { id: 'AAB', node: true },
        });
        items[6] = new TreeItem({
            nodeProperty: 'node',
            parent: items[1],
            contents: { id: 'AAC', node: true },
        });
        items[7] = new TreeItem({
            nodeProperty: 'node',
            parent: items[6],
            contents: { id: 'AACa' },
        });
        items[8] = new TreeItem({
            nodeProperty: 'node',
            parent: items[1],
            contents: { id: 'AAD', node: true },
        });
        items[9] = new TreeItem({
            nodeProperty: 'node',
            parent: display.getRoot(),
            contents: { id: 'B', node: true },
        });
        items[10] = new TreeItem({
            nodeProperty: 'node',
            parent: display.getRoot(),
            contents: { id: 'C', node: true },
        });
        items[11] = new TreeItem({
            nodeProperty: 'node',
            parent: display.getRoot(),
            contents: { id: 'd' },
        });
        items[12] = new TreeItem({
            nodeProperty: 'node',
            parent: display.getRoot(),
            contents: { id: 'e' },
        });

        source = getSource(items, { display });
        strategy = new SearchStrategy({
            source,
            display,
            treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
        });
    });

    afterEach(() => {
        items = undefined;
        source = undefined;
        strategy = undefined;
    });

    describe('.options', () => {
        it('should return the source options', () => {
            expect(strategy.options).toBe(source.options);
        });
    });

    describe('.items', () => {
        it('should group breadcrumbs nodes', () => {
            const strategy = new SearchStrategy<string | string[]>({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const expected = [
                '#A,AA,AAA',
                'AAAa',
                'AAAb',
                '#A,AA,AAB',
                '#A,AA,AAC',
                'AACa',
                '#A,AA,AAD',
                '#B',
                '#C',
                'd',
                'e',
            ];

            strategy.items.forEach((item, index) => {
                expect(stringifyResult(item.getContents())).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it('should group only breadcrumbs nodes', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'AA', node: true },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: { id: 'AAA', node: true },
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents());
            });

            expect(result).toEqual(['#A,AA,AAA']);
        });

        it('should put children of hidden node after the breadcrumbs', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'a', node: false },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'B', node: true },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'c', node: null },
            });
            items[3] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'D', node: true },
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents());
            });

            expect(result).toEqual(['a', '#a,B', 'c', '#a,D']);
        });

        it('should add breadcrumbs before a leaf which has different parent than previous leaf', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'B', node: true },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: { id: 'c', node: false },
            });
            items[3] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'd', node: false },
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents());
            });

            expect(result).toEqual(['#A,B', 'c', '#A', 'd']);
        });

        it('should return valid items level for first item after breadcrumbs', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'AA', node: true },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: { id: 'AAa', node: false },
            });
            items[3] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'b', node: false },
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents()) + ':' + item.getLevel();
            });

            expect(result).toEqual(['#A,AA:1', 'AAa:2', 'b:1']);
        });

        it('return breadcrumbs as 1st level parent for leaves', () => {
            const parents = [];
            parents[1] = BreadcrumbsItem;
            parents[2] = BreadcrumbsItem;
            parents[3] = BreadcrumbsItem;
            parents[4] = BreadcrumbsItem;
            parents[5] = BreadcrumbsItem;
            parents[6] = BreadcrumbsItem;
            parents[7] = BreadcrumbsItem;
            parents[8] = BreadcrumbsItem;
            parents[9] = display.getRoot();
            parents[10] = display.getRoot();
            parents[11] = display.getRoot();

            const levels = [];
            levels[1] = 2;
            levels[2] = 2;
            levels[3] = 2;
            levels[4] = 2;
            levels[5] = 2;
            levels[6] = 2;
            levels[7] = 2;
            levels[8] = 2;
            levels[9] = 1;
            levels[10] = 1;
            levels[11] = 1;

            strategy.items.forEach((item, index) => {
                if (item instanceof TreeItem) {
                    if (typeof parents[index] === 'function') {
                        expect(item.getParent()).toBeInstanceOf(parents[index]);
                    } else {
                        expect(item.getParent()).toBe(parents[index]);
                    }

                    expect(item.getLevel()).toEqual(levels[index]);
                }
            });
        });

        it('shouldn place leaves before nodes for single breadcrumbs', () => {
            items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'b' },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'C', node: true },
            });
            items[3] = new TreeItem({
                nodeProperty: 'node',
                parent: items[2],
                contents: { id: 'd' },
            });
            items[4] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'e' },
            });

            source = getSource(items, { display });
            strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents()) + ':' + item.getLevel();
            });

            expect(result).toEqual(['#A:1', 'b:2', 'e:2', '#A,C:1', 'd:2']);
        });

        it('should keep level for descendant of leaf', () => {
            items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'b' },
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: { id: 'c' },
            });

            source = getSource(items, { display });
            strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents()) + ':' + item.getLevel();
            });

            expect(result).toEqual(['#A:1', 'b:2', 'c:3']);
        });

        it("shouldn't return breadcrumbs finished with leaf", () => {
            items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: { id: 'A', node: true },
            });
            const leaf = (items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: { id: 'b' },
            }));
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: leaf,
                contents: { id: 'C', node: true },
            });
            items[3] = new TreeItem({
                nodeProperty: 'node',
                parent: items[2],
                contents: { id: 'd' },
            });
            items[4] = new TreeItem({
                nodeProperty: 'node',
                parent: leaf,
                contents: { id: 'e' },
            });
            items[5] = new TreeItem({
                nodeProperty: 'node',
                parent: items[2],
                contents: { id: 'f' },
            });

            source = getSource(items, { display });
            strategy = new SearchStrategy({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                return stringifyResult(item.getContents()) + ':' + item.getLevel();
            });

            expect(result).toEqual(['#A:1', 'b:2', 'e:3', '#A,b,C:1', 'd:2', 'f:2']);
        });

        it('should organize dedicated breadcrumbs for first item', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: new StringContents({
                    id: 'A',
                    break: true,
                    node: true,
                }),
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: new StringContents({
                    id: 'AA',
                    break: false,
                    node: true,
                }),
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: new StringContents({
                    id: 'AAA',
                    break: false,
                    node: true,
                }),
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                dedicatedItemProperty: 'break',
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                const contents = item.getContents();
                return item instanceof BreadcrumbsItem
                    ? `#${contents
                          .map((it) => {
                              return it.id;
                          })
                          .join(',')}`
                    : contents.id;
            });

            expect(result).toEqual(['#A', '#A,AA,AAA']);
        });

        it('should organize dedicated breadcrumbs for inner item', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: new StringContents({
                    id: 'A',
                    break: false,
                    node: true,
                }),
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: new StringContents({
                    id: 'AA',
                    break: true,
                    node: true,
                }),
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: new StringContents({
                    id: 'AAA',
                    break: false,
                    node: true,
                }),
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                dedicatedItemProperty: 'break',
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                const contents = item.getContents();
                return item instanceof BreadcrumbsItem
                    ? `#${contents
                          .map((it) => {
                              return it.id;
                          })
                          .join(',')}`
                    : contents.id;
            });

            expect(result).toEqual(['#A,AA', '#A,AA,AAA']);
        });

        it('should organize dedicated breadcrumbs for last item', () => {
            const items = [];
            items[0] = new TreeItem({
                nodeProperty: 'node',
                parent: display.getRoot(),
                contents: new StringContents({
                    id: 'A',
                    break: false,
                    node: true,
                }),
            });
            items[1] = new TreeItem({
                nodeProperty: 'node',
                parent: items[0],
                contents: new StringContents({
                    id: 'AA',
                    break: false,
                    node: true,
                }),
            });
            items[2] = new TreeItem({
                nodeProperty: 'node',
                parent: items[1],
                contents: new StringContents({
                    id: 'AAA',
                    break: true,
                    node: true,
                }),
            });

            const source = getSource(items, { display });
            const strategy = new SearchStrategy({
                dedicatedItemProperty: 'break',
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const result = strategy.items.map((item) => {
                const contents = item.getContents();
                return item instanceof BreadcrumbsItem
                    ? `#${contents
                          .map((it) => {
                              return it.id;
                          })
                          .join(',')}`
                    : contents.id;
            });

            expect(result).toEqual(['#A,AA,AAA']);
        });

        it('should return the same instances for second call', () => {
            const items = strategy.items.slice();

            strategy.items.forEach((item, index) => {
                expect(items[index]).toBe(item);
            });

            expect(items.length).toEqual(strategy.items.length);
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toEqual(11);
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return index in projection', () => {
            const next = strategy.count;
            const expected = [next, next, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return index in collection', () => {
            const expected = [-1, 3, 4, -1, -1, 7, -1, -1, -1, 11, 12];
            strategy.items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const source = getSource(items, { display });
            const strategy = new SearchStrategy<string | string[]>({
                source: source as any,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            const newItems = [
                new TreeItem({
                    nodeProperty: 'node',
                    parent: items[2],
                    contents: { id: 'AAAc' },
                }),
            ];
            const at = 3;
            const expected = [
                '#A,AA,AAA',
                'AAAc',
                'AAAa',
                'AAAb',
                '#A,AA,AAB',
                '#A,AA,AAC',
                'AACa',
                '#A,AA,AAD',
                '#B',
                '#C',
                'd',
                'e',
            ];

            strategy.splice(at, 0, newItems as any);

            strategy.items.forEach((item, index) => {
                expect(stringifyResult(item.getContents())).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it('should remove items', () => {
            const strategy = new SearchStrategy<string | string[]>({
                source,
                display,
                treeItemDecoratorModule: 'Controls/display:TreeItemDecorator',
            });

            // AA
            const at = 1;

            // AA + AAA
            const sourceRemoveCount = 2;
            const removeCount = 2;
            const expected = [
                '#A',
                '#A,AA,AAA',
                'AAAa',
                'AAAb',
                '#A,AA,AAB',
                '#A,AA,AAC',
                'AACa',
                '#A,AA,AAD',
                '#B',
                '#C',
                'd',
                'e',
            ];

            const sourceCount = source.count;
            strategy.splice(at, removeCount, []);

            expect(source.count).toBe(sourceCount - sourceRemoveCount);

            expect(strategy.count).toBe(expected.length);

            strategy.items.forEach((item, index) => {
                expect(stringifyResult(item.getContents())).toEqual(expected[index]);
            });
        });
    });

    describe('.reset()', () => {
        it('should reset items', () => {
            strategy.reset();
            expect(strategy.items.length).toBe(0);
        });
    });

    it('right parent for items', () => {
        const recordSet = new RecordSet({
            rawData: [
                {
                    id: 1,
                    parent: null,
                    node: true,
                    hasChildren: true,
                },
                {
                    id: 2,
                    parent: 1,
                    node: false,
                    hasChildren: false,
                },
                {
                    id: 3,
                    parent: null,
                    node: null,
                    hasChildren: false,
                },
            ],
            keyProperty: 'id',
        });

        const searchCollection = new SearchCollection({
            collection: recordSet,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
            hasChildrenProperty: 'hasChildren',
        });

        const items = searchCollection.getItems();
        expect(items[0].getParent().isRoot()).toBe(true);
        expect(items[1].getParent()).toEqual(items[0]);
        expect(items[3].getParent().isRoot()).toBe(true);
    });
});
