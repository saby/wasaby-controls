import Group from 'Controls/_display/itemsStrategy/Group';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';
import { groupConstants } from 'Controls/list';

import { GroupItem, CollectionItem } from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';

function getMockedDisplay(config?: { backgroundStyle?: string }): Object {
    return {
        getAdditionalGroupConstructorParams() {
            return {
                multiSelectVisibility: 'hidden',
                metaResults: {},
                backgroundStyle: config?.backgroundStyle,
            };
        },
        hasMoreDataUp: () => {
            return false;
        },
        isStickyHeader: () => {
            return false;
        },
        getTheme: () => {
            return '';
        },
        getStyle: () => {
            return '';
        },
    };
}

describe('Controls/_display/itemsStrategy/Group', () => {
    function wrapItem<S, T = TreeItem<S>>(item: S): T {
        return new TreeItem<S>({
            contents: item,
        }) as any as T;
    }

    function getSource<S, T = TreeItem<S>>(items: S[]): IItemsStrategy<S, T> {
        const wraps = items.map<T>(wrapItem);

        return {
            '[Controls/_display/IItemsStrategy]': true,
            source: null,
            options: {
                display: getMockedDisplay(),
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
                items.length = 0;
            },
        };
    }

    let items: string[];
    let source;
    let strategy;

    beforeEach(() => {
        items = ['one', 'two', 'three'];
        source = getSource(items);
        strategy = new Group({ source });
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

    describe('.at()', () => {
        it('should return item', () => {
            source.items.forEach((item, index) => {
                expect(strategy.at(index)).toBe(item);
            });
        });

        it('should return group before item', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: () => {
                    return 'foo';
                },
            });
            const expected = [
                'foo',
                source.items[0].getContents(),
                source.items[1].getContents(),
                source.items[2].getContents(),
            ];

            expect(strategy.at(0)).toBeInstanceOf(GroupItem);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
        });

        it('should throw an ReferenceError if index is out of bounds', () => {
            expect(() => {
                strategy.at(-1);
            }).toThrow();

            expect(() => {
                strategy.at(strategy.count);
            }).toThrow();
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toBe(source.items.length);
        });

        it('should return items count with groups', () => {
            const strategy = new Group<string>({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return item;
                },
            });
            expect(strategy.count).toBe(2 * source.items.length);
        });
    });

    describe('.items', () => {
        it('should return source items', () => {
            expect(strategy.items).toEqual(source.items);
        });

        it('should return items with groups', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const expected = [];

            source.items.forEach((item) => {
                expected.push('#' + item.getContents());
                expected.push(item.getContents());
            });

            expect(
                strategy.items.map((item) => {
                    return item.getContents();
                })
            ).toEqual(expected);
        });

        it('should place groups before their items', () => {
            const items = [
                { id: 'a', group: 'one' },
                { id: 'b', group: 'two' },
                { id: 'c', group: 'one' },
                { id: 'd', group: 'two' },
            ];
            const source = getSource(items);
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return item.group;
                },
            });
            const expected = [
                'one',
                items[0],
                items[2],
                'two',
                items[1],
                items[3],
            ];

            expect(
                strategy.items.map((item) => {
                    return item.getContents();
                })
            ).toEqual(expected);
        });

        it('should return items after group has gone', () => {
            const items = ['one', 'two', 'three'];
            const source = getSource(items);
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });

            ['#one', 'one', '#two', 'two', '#three', 'three'].forEach(
                (expected, index) => {
                    expect(strategy.items[index].getContents()).toBe(expected);
                }
            );

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            ['#one', 'one', '#four', 'four', '#three', 'three'].forEach(
                (expected, index) => {
                    expect(strategy.items[index].getContents()).toBe(expected);
                }
            );
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const items = [1, 2];
            const count = strategy.count;
            strategy.splice(0, 0, items);
            expect(strategy.count).toBe(items.length + count);
        });

        it('should add items before first group', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const newItems = ['four', 'five'];
            const expected = [
                '#four',
                'four',
                '#five',
                'five',
                '#one',
                'one',
                '#two',
                'two',
                '#three',
                'three',
            ];

            strategy.splice(0, 0, newItems);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
            expect(strategy.count).toBe(expected.length);
        });

        it('should add items after first group', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const newItems = ['four', 'five'];
            const expected = [
                '#one',
                'one',
                '#four',
                'four',
                '#five',
                'five',
                '#two',
                'two',
                '#three',
                'three',
            ];

            strategy.splice(1, 0, newItems);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
            expect(strategy.count).toBe(expected.length);
        });

        it('should add items after last group', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const newItems = ['four', 'five'];
            const expected = [
                '#one',
                'one',
                '#two',
                'two',
                '#three',
                'three',
                '#four',
                'four',
                '#five',
                'five',
            ];

            strategy.splice(items.length, 0, newItems);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
            expect(strategy.count).toBe(expected.length);
        });

        it('should remove item and group', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const expected = ['#two', 'two', '#three', 'three'];

            strategy.splice(0, 1, []);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
            expect(strategy.count).toBe(expected.length);
        });

        it('should remove item and keep group', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: () => {
                    return '#foo';
                },
            });
            const expected = ['#foo', 'two', 'three'];

            strategy.splice(0, 1, []);
            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
            expect(strategy.count).toBe(expected.length);
        });
    });

    describe('.reset()', () => {
        it('should reset group items', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });
            const oldItems = strategy.items;

            strategy.reset();
            const newItems = strategy.items;

            oldItems.forEach((item, index) => {
                if (item['[Controls/_display/GroupItem]']) {
                    expect(newItems[index]).not.toBe(oldItems[index]);
                    expect(newItems[index].getContents()).toEqual(
                        oldItems[index].getContents()
                    );
                } else {
                    expect(newItems[index]).toBe(oldItems[index]);
                }
            });
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return valid index', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });

            source.items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(1 + 2 * index);
            });
        });

        it('should return last index', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: () => {
                    return 'foo';
                },
            });

            expect(strategy.getDisplayIndex(strategy.count)).toBe(
                strategy.count
            );
        });

        it('should return valid index after group has gone', () => {
            const items = ['one', 'two', 'three'];
            const source = getSource(items);
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });

            [1, 3, 5].forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(item);
            });

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            [1, 3, 5].forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(item);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return valid index', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });

            strategy.items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(
                    index % 2 ? (index - 1) / 2 : -1
                );
            });
        });

        it('should return -1 if index out of bounds', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: () => {
                    return 'foo';
                },
            });

            expect(strategy.getCollectionIndex(strategy.count)).toBe(-1);
        });

        it('should return valid index after group has gone', () => {
            const items = ['one', 'two', 'three'];
            const source = getSource(items);
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            });

            [-1, 0, -1, 1, -1, 2].forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(item);
            });

            source.splice(1, 1, ['four']);
            strategy.invalidate();

            [-1, 0, -1, 1, -1, 2].forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(item);
            });
        });
    });

    describe('::sortItems', () => {
        it('should return original items order if handler is not presented', () => {
            const items = [
                new CollectionItem(),
                new CollectionItem(),
                new CollectionItem(),
            ];
            const groups = [new GroupItem()];
            const options: any = {
                display: getMockedDisplay(),
                groups,
                groupConstructor: GroupItem,
                handler: null,
            };
            const expected = [0, 1, 2];
            const given = Group.sortItems(items, options);

            expect(given).toEqual(expected);
        });

        it('should create single group', () => {
            const items = [
                new CollectionItem({ contents: 'one' }),
                new CollectionItem({ contents: 'two' }),
                new CollectionItem({ contents: 'three' }),
            ];
            const groups = [];
            const options: any = {
                display: getMockedDisplay(),
                groups,
                groupConstructor: GroupItem,
                handler: () => {
                    return 'foo';
                },
            };
            const expected = [0, 1, 2, 3];
            const given = Group.sortItems(items, options);

            expect(given).toEqual(expected);

            expect(groups.length).toEqual(1);
            expect(groups[0].getContents()).toEqual('foo');
        });

        it('should create several groups', () => {
            const items = [
                new CollectionItem({ contents: 'one' }),
                new CollectionItem({ contents: 'two' }),
                new CollectionItem({ contents: 'three' }),
            ];
            const groups = [];
            const options: any = {
                display: getMockedDisplay(),
                groups,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            };
            const expected = [0, 3, 1, 4, 2, 5];
            const expectedGroups = ['#one', '#two', '#three'];
            const given = Group.sortItems(items, options);

            expect(given).toEqual(expected);

            expect(groups.length).toEqual(3);
            groups.forEach((group, index) => {
                expect(group.getContents()).toEqual(expectedGroups[index]);
            });
        });

        describe('hidden group is always number one', () => {
            it('hidden group is first in items', () => {
                const createItem = (id: number, group?: string) => {
                    return {
                        contents: {
                            group: group || groupConstants.hiddenGroup,
                            id,
                        },
                        multiSelectVisibility: 'hidden',
                    };
                };
                const items = [
                    new CollectionItem(createItem(1)),
                    new CollectionItem(createItem(2)),
                    new CollectionItem(createItem(3, 'one')),
                    new CollectionItem(createItem(4, 'one')),
                ];
                const groups = [];
                const options: any = {
                    display: getMockedDisplay(),
                    groups,
                    groupConstructor: GroupItem,
                    handler: (item) => {
                        return item.group;
                    },
                };
                const expected = [0, 2, 3, 1, 4, 5];
                const expectedGroups = [groupConstants.hiddenGroup, 'one'];
                const given = Group.sortItems(items, options);

                expect(given).toEqual(expected);

                expect(groups.length).toEqual(2);
                groups.forEach((group, index) => {
                    expect(group.getContents()).toEqual(expectedGroups[index]);
                });
            });
            it('hidden group is not first in items', () => {
                const createItem = (id: number, group?: string) => {
                    return {
                        contents: {
                            group: group || groupConstants.hiddenGroup,
                            id,
                        },
                        multiSelectVisibility: 'hidden',
                    };
                };
                const items = [
                    new CollectionItem(createItem(1, 'one')),
                    new CollectionItem(createItem(2)),
                    new CollectionItem(createItem(3)),
                    new CollectionItem(createItem(4, 'one')),
                ];
                const groups = [];
                const options: any = {
                    display: getMockedDisplay(),
                    groups,
                    groupConstructor: GroupItem,
                    handler: (item) => {
                        return item.group;
                    },
                    hiddenGroupPosition: 'first',
                };
                const expected = [1, 3, 4, 0, 2, 5];
                const expectedGroups = ['one', groupConstants.hiddenGroup];
                const given = Group.sortItems(items, options);

                expect(given).toEqual(expected);

                expect(groups.length).toEqual(2);
                groups.forEach((group, index) => {
                    expect(group.getContents()).toEqual(expectedGroups[index]);
                });
            });
        });

        it('should use old groups', () => {
            const items = [
                new CollectionItem({ contents: 'one' }),
                new CollectionItem({ contents: 'two' }),
                new CollectionItem({ contents: 'three' }),
            ];
            const groups = [
                new GroupItem({ contents: '#one' }),
                new GroupItem({ contents: '#three' }),
            ];
            const options: any = {
                display: getMockedDisplay(),
                groups,
                groupConstructor: GroupItem,
                handler: (item) => {
                    return '#' + item;
                },
            };
            const expected = [0, 3, 2, 4, 1, 5];
            const expectedGroups = ['#one', '#three', '#two'];
            const oldGroups = groups.slice();
            const given = Group.sortItems(items, options);

            expect(given).toEqual(expected);

            expect(groups.length).toEqual(3);
            groups.forEach((group, index) => {
                expect(group.getContents()).toEqual(expectedGroups[index]);
            });

            expect(groups.slice(0, 2)).toEqual(oldGroups);
        });
    });

    describe('.toJSON()', () => {
        it('should serialize the strategy', () => {
            const json = strategy.toJSON();

            expect(json.state.$options.source).toBe(source);
            expect(json.state._groups.length).toBe(0);
        });

        it('should serialize itemsOrder if handler is defined', () => {
            const strategy = new Group({
                source,
                groupConstructor: GroupItem,
                handler: () => {
                    return '#foo';
                },
            });
            const json = strategy.toJSON() as any;

            expect(json.state._itemsOrder.length).toBe(source.count + 1);
        });
    });

    describe('::fromJSON()', () => {
        it('should clone the strategy', () => {
            const groups = strategy.groups;
            const clone = (Group as any).fromJSON(strategy.toJSON());

            expect(clone.groups).toEqual(groups);
        });
    });

    describe('backgroundStyle', () => {
        const items = [
            new CollectionItem({ contents: 'one' }),
            new CollectionItem({ contents: 'one' }),
        ];
        const groups = [];

        const options: any = {
            display: getMockedDisplay({ backgroundStyle: 'stack' }),
            groups,
            groupConstructor: GroupItem,
            handler: (item) => {
                return '#' + item;
            },
        };
        Group.sortItems(items, options);
        expect(groups[0].getBackgroundStyle()).toEqual('stack');
    });
});
