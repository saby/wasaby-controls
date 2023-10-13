import { RootStrategy as Root } from 'Controls/baseTree';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';

describe('Controls/baseTree:Root', () => {
    function getSource<S>(items: S[]): IItemsStrategy<S, S> {
        return {
            '[Controls/_display/IItemsStrategy]': true,
            options: {},
            source: null,
            get count(): number {
                return items.length;
            },
            get items(): S[] {
                return items.slice();
            },
            at(index: number): S {
                return items[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: S[]): S[] {
                return items.splice(start, deleteCount, ...(added || []));
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
            },
        };
    }

    const root = () => {
        return 'root';
    };

    let items: string[];
    let source: IItemsStrategy<string, string>;
    let strategy: Root<string, string>;

    beforeEach(() => {
        items = ['one', 'two', 'three'];
        source = getSource(items);
        strategy = new Root({
            source,
            root,
        });
    });

    afterEach(() => {
        items = undefined;
        source = undefined;
        strategy = undefined;
    });

    describe('.getOptions()', () => {
        it('should return the source options', () => {
            expect(strategy.options).toBe(source.options);
        });
    });

    describe('.at()', () => {
        it('should return root at 0', () => {
            expect(strategy.at(0)).toBe(root());
        });

        it('should return item with offset', () => {
            source.items.forEach((item, index) => {
                expect(strategy.at(1 + index)).toBe(item);
            });
        });
    });

    describe('.count', () => {
        it('should return items count with root', () => {
            expect(strategy.count).toBe(1 + source.items.length);
        });
    });

    describe('.items', () => {
        it('should return an items with root', () => {
            expect(strategy.items).toEqual([root()].concat(source.items));
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return an index with offset', () => {
            expect(strategy.getDisplayIndex(0)).toBe(1);
            expect(strategy.getDisplayIndex(1)).toBe(2);
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return an index with offset', () => {
            expect(strategy.getCollectionIndex(1)).toBe(0);
            expect(strategy.getCollectionIndex(2)).toBe(1);
        });
    });

    describe('.splice()', () => {
        it('should add items', () => {
            const items = ['a', 'b'];
            const count = strategy.count;
            strategy.splice(0, 0, items);
            expect(strategy.count).toBe(items.length + count);
        });
    });

    describe('.reset()', () => {
        it('should reset items', () => {
            strategy.reset();
            expect(strategy.items.length).toBe(1);
        });
    });
});
