import Direct from 'Controls/_display/itemsStrategy/Direct';

import { Collection as CollectionDisplay, CollectionItem } from 'Controls/display';

import { List, Enum } from 'Types/collection';

describe('Controls/_display/itemsStrategy/Direct', () => {
    function getStrategy<T>(display: CollectionDisplay<T>): Direct<T> {
        return new Direct({
            display,
        });
    }

    let items;
    let list;
    let display;
    let strategy;

    beforeEach(() => {
        items = [1, 2, 3];
        list = new List({ items });
        display = new CollectionDisplay({ collection: list });
        strategy = getStrategy(display);
    });

    afterEach(() => {
        items = undefined;
        list = undefined;
        display = undefined;
        strategy = undefined;
    });

    describe('.at()', () => {
        it('should return a CollectionItem', () => {
            items.forEach((item, index) => {
                expect(strategy.at(index)).toBeInstanceOf(CollectionItem);
                expect(strategy.at(index).getContents()).toBe(item);
            });
        });

        it('should return the same CollectionItem twice', () => {
            items.forEach((item, index) => {
                expect(strategy.at(index)).toBe(strategy.at(index));
            });
        });
    });

    describe('.count', () => {
        it('should return items count for List', () => {
            expect(strategy.count).toBe(items.length);
        });

        it('should return items count for Enumerable', () => {
            const list = new Enum({ dictionary: items });
            const display = new CollectionDisplay({ collection: list });
            const strategy = getStrategy(display);

            expect(strategy.count).toBe(items.length);
        });

        it('should return intitial items count if List count changed', () => {
            const expected = list.getCount();
            expect(strategy.count).toBe(expected);
            list.removeAt(0);
            expect(strategy.count).toBe(expected);
        });
    });

    describe('.items', () => {
        it('should return an items', () => {
            expect(strategy.items.length).toBe(items.length);
            items.forEach((item, index) => {
                expect(strategy.items[index].getContents()).toBe(items[index]);
            });
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            expect(strategy.items.length).toBe(items.length);

            items.splice(0, 0, 4, 5);
            strategy.splice(0, 0, items.slice(0, 2));
            expect(strategy.items.length).toBe(items.length);
            expect(strategy.items[0].getContents()).toBe(items[0]);
            expect(strategy.items[1].getContents()).toBe(items[1]);
        });

        it('should remove items', () => {
            strategy.splice(0, 2);
            expect(strategy.items.length).toBe(items.length - 2);
        });
    });

    describe('.reset()', () => {
        it('should re-create items', () => {
            const prevItems = [];
            items.forEach((item, index) => {
                prevItems.push(strategy.at(index));
            });

            strategy.reset();
            items.forEach((item, index) => {
                expect(strategy.at(index)).not.toBe(prevItems[index]);
            });
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return equal indices', () => {
            items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(index);
            });
        });

        it('should return shifted indices in unique mode if source has repeats', () => {
            const items = [{ id: 1 }, { id: 1 }, { id: 2 }];
            const list = new List({ items });
            const display = new CollectionDisplay({ collection: list });
            const strategy = new Direct({
                display,
                keyProperty: 'id',
                unique: true,
            });
            const expected = [0, 2, 1];

            items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(expected[index]);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return equal indices', () => {
            items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(index);
            });
        });

        it('should return shifted indices in unique mode if source has repeats', () => {
            const items = [{ id: 1 }, { id: 1 }, { id: 2 }];
            const list = new List({ items });
            const display = new CollectionDisplay({ collection: list });
            const strategy = new Direct({
                display,
                keyProperty: 'id',
                unique: true,
            });
            const expected = [0, 2, -1];

            items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(expected[index]);
            });
        });
    });

    describe('::sortItems()', () => {
        it('should return original order by default', () => {
            const items = [{}, {}, {}];
            const expected = [0, 1, 2];
            const given = Direct.sortItems(items, {});

            expect(given).toEqual(expected);
        });

        it('should return items with unique ids', () => {
            const items = [
                new CollectionItem({ contents: { id: 1 } }),
                new CollectionItem({ contents: { id: 2 } }),
                new CollectionItem({ contents: { id: 1 } }),
                new CollectionItem({ contents: { id: 3 } }),
            ];
            const options = {
                unique: true,
                keyProperty: 'id',
            };
            const expected = [0, 1, 3];
            const given = Direct.sortItems(items, options);

            expect(given).toEqual(expected);
        });
    });
});
