import User from 'Controls/_display/itemsStrategy/User';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';
import { SortFunction } from 'Controls/_display/Collection';
import { CollectionItem } from 'Controls/display';

describe('Controls/_display/itemsStrategy/User', () => {
    function wrapItem<S, T>(item: S): T {
        return new CollectionItem({
            contents: item,
        }) as any as T;
    }

    function getSource<S, T = CollectionItem<S>>(items: S[]): IItemsStrategy<S, T> {
        const wraps = items.map<T>(wrapItem);

        return {
            '[Controls/_display/IItemsStrategy]': true,
            options: {},
            source: null,
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
                added = added || [];
                items.splice(start, deleteCount, ...added);
                return wraps.splice(start, deleteCount, ...added.map<T>(wrapItem));
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
                wraps.length = 0;
            },
        };
    }

    function getStrategy<S, T extends CollectionItem<S> = CollectionItem<S>>(
        source: IItemsStrategy<S, T>,
        handlers: SortFunction<S, T>[]
    ): User<S, T> {
        return new User({
            source,
            handlers,
        });
    }

    let source: IItemsStrategy<string, CollectionItem<string>>;
    let strategy: User<string>;

    beforeEach(() => {
        source = getSource(['one', 'two', 'three']);
        strategy = getStrategy(source, []);
    });

    afterEach(() => {
        source = undefined;
        strategy = undefined;
    });

    describe('.options', () => {
        it('should return the source options', () => {
            expect(strategy.options).toBe(source.options);
        });
    });

    describe('.at()', () => {
        it('should return every item', () => {
            source.items.forEach((item, index) => {
                expect(strategy.at(index)).toBe(item);
            });
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return a.item.getContents() - b.item.getContents();
                },
            ]);
            const expected = [1, 2, 3];

            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
        });

        it('should return reversed items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return b.item.getContents() - a.item.getContents();
                },
            ]);
            const expected = [3, 2, 1];

            expected.forEach((item, index) => {
                expect(strategy.at(index).getContents()).toBe(item);
            });
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toBe(source.items.length);
        });
    });

    describe('.items', () => {
        it('should return an items', () => {
            expect(strategy.items).toEqual(source.items);
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return a.item.getContents() - b.item.getContents();
                },
            ]);
            const items = strategy.items;
            const expected = [1, 2, 3];

            items.forEach((item, index) => {
                expect(item.getContents()).toBe(expected[index]);
            });
            expect(items.length).toEqual(expected.length);
        });

        it('should return direct items order', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return b.item.getContents() - a.item.getContents();
                },
            ]);
            const items = strategy.items;
            const expected = [3, 2, 1];

            items.forEach((item, index) => {
                expect(item.getContents()).toBe(expected[index]);
            });
            expect(items.length).toEqual(expected.length);
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const items = ['1', '2'];
            const count = strategy.count;
            strategy.splice(0, 0, items);
            expect(strategy.count).toBe(items.length + count);
        });

        it('should push item after latest source item', () => {
            const items = [1, 2, 3];
            const source = getSource(items);
            const strategy = getStrategy(source, []);
            const newItem = 4;

            strategy.splice(strategy.count, 0, [newItem]);

            expect(items[items.length - 1]).toBe(newItem);
        });

        it('should remove items', () => {
            strategy.splice(1, 2);
            expect(strategy.at(0)).toBe(source.items[0]);
            expect(strategy.at(1)).toBe(source.items[2]);
        });
    });

    describe('.reset()', () => {
        it('should reset items', () => {
            strategy.reset();
            expect(strategy.items.length).toBe(0);
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return equal indices', () => {
            source.items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toBe(index);
            });
        });

        it('should return direct index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return a.item.getContents() - b.item.getContents();
                },
            ]);
            const expected = [0, 1, 2];

            expected.forEach((strategyIndex, collectionIndex) => {
                expect(strategy.getDisplayIndex(collectionIndex)).toBe(strategyIndex);
            });
        });

        it('should return reversed index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return b.item.getContents() - a.item.getContents();
                },
            ]);
            const expected = [2, 1, 0];

            expected.forEach((strategyIndex, collectionIndex) => {
                expect(strategy.getDisplayIndex(collectionIndex)).toBe(strategyIndex);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return equal indices', () => {
            source.items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toBe(index);
            });
        });

        it('should return direct index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return a.item.getContents() - b.item.getContents();
                },
            ]);
            const expected = [0, 1, 2];

            expected.forEach((collectionIndex, strategyIndex) => {
                expect(strategy.getCollectionIndex(collectionIndex)).toBe(strategyIndex);
            });
        });

        it('should return reversed index', () => {
            const source = getSource([1, 2, 3]);
            const strategy = getStrategy(source, [
                (a, b) => {
                    return b.item.getContents() - a.item.getContents();
                },
            ]);
            const expected = [2, 1, 0];

            expected.forEach((collectionIndex, strategyIndex) => {
                expect(strategy.getCollectionIndex(collectionIndex)).toBe(strategyIndex);
            });
        });
    });

    describe('.toJSON()', () => {
        it('should serialize the strategy', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [];
            const strategy = getStrategy(source, handlers);
            const items = strategy.items;
            const json = strategy.toJSON() as any;

            expect(json.state.$options.source).toBe(source);
            expect(json.state.$options.handlers).toBe(handlers);
            expect(json.state._itemsOrder.length).toBe(items.length);
        });

        it('should serialize itemsOrder if handlers is defined', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [
                () => {
                    return 0;
                },
            ];
            const strategy = getStrategy(source, handlers);
            const json = strategy.toJSON() as any;

            expect(json.state._itemsOrder.length).toBe(source.count);
        });
    });

    describe('::fromJSON()', () => {
        it('should clone the strategy', () => {
            const source = getSource([1, 2, 3]);
            const handlers = [];
            const strategy = getStrategy(source, handlers);
            const items = strategy.items;
            const clone = (User as any).fromJSON(strategy.toJSON());

            expect(clone.items).toEqual(items);
        });
    });
});
