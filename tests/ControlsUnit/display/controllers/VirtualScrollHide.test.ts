import * as VirtualScrollHideController from 'Controls/_display/controllers/VirtualScrollHide';

describe('Controls/_display/controllers/VirtualScrollHide', () => {
    function makeHideItem() {
        const item = {
            _$rendered: false,
            isRendered: () => {
                return item._$rendered;
            },
            setRendered: (rendered) => {
                return (item._$rendered = rendered);
            },
            setRenderedOutsideRange: () => {
                return null;
            },
            isRenderedOutsideRange: () => {
                return false;
            },
        };
        return item;
    }

    function makeEnumerator() {
        const enumerator = {
            _$position: -1,
            getPosition: () => {
                return enumerator._$position;
            },
            setPosition: (position) => {
                return (enumerator._$position = position);
            },
            getCurrentIndex: () => {
                return enumerator.getPosition();
            },

            moveNext: () => {
                enumerator._$position++;
                return true;
            },
            getCurrent: () => {
                return null;
            },
        };
        return enumerator;
    }

    function makeCollection() {
        const collection = {
            _$version: 0,
            nextVersion: () => {
                return collection._$version++;
            },
            _$items: Array.from({ length: 100 }).map((_) => {
                return {
                    StickableItem: true,
                    isSticked: () => {
                        return false;
                    },
                    setRenderedOutsideRange: () => {
                        return null;
                    },
                    isRenderedOutsideRange: () => {
                        return false;
                    },
                };
            }),
            _$count: 100,
            getCount: () => {
                return collection._$count;
            },

            _$viewIterator: null,
            getViewIterator: () => {
                return collection._$viewIterator;
            },
            setViewIterator: (viewIterator) => {
                return (collection._$viewIterator = viewIterator);
            },

            getEnumerator: () => {
                return null;
            },
            at: (index) => {
                return collection._$items[index];
            },
        };
        return collection;
    }

    describe('setup()', () => {
        it('sets view iterator with required fields', () => {
            const collection = makeCollection();

            VirtualScrollHideController.setup(collection);

            expect(typeof collection._$viewIterator.each).toBe('function');
            expect(typeof collection._$viewIterator.setIndices).toBe(
                'function'
            );
            expect(typeof collection._$viewIterator.isItemAtIndexHidden).toBe(
                'function'
            );

            const { startIndex, stopIndex } = collection._$viewIterator.data;
            expect(startIndex).toBe(0);
            expect(stopIndex).toBe(100);

            expect(collection._$version).toBeGreaterThan(0);
        });
    });

    describe('setIndices()', () => {
        it('sets items from start to stop index as rendered', () => {
            const collection = makeCollection();

            const items = [];
            for (let i = 0; i < 10; i++) {
                items.push(makeHideItem());
            }

            collection._$count = items.length;
            collection.at = (index) => {
                return items[index];
            };

            const startIndex = 5;
            const stopIndex = 8;

            VirtualScrollHideController.setup(collection);
            VirtualScrollHideController.setIndices(
                collection,
                startIndex,
                stopIndex
            );

            items.forEach((item, index) => {
                expect(item._$rendered).toBe(
                    index >= startIndex && index < stopIndex
                );
            });
        });
    });

    describe('each()', () => {
        it('iterates over all rendered items ever', () => {
            const collection = makeCollection();

            const items = [];
            for (let i = 0; i < 10; i++) {
                items.push(makeHideItem());
            }

            collection._$count = items.length;
            collection.at = (index) => {
                return items[index];
            };

            VirtualScrollHideController.setup(collection);
            VirtualScrollHideController.setIndices(collection, 5, 8);
            VirtualScrollHideController.setIndices(collection, 1, 3);

            const enumerator = makeEnumerator();
            enumerator.moveNext = () => {
                enumerator._$position++;
                return enumerator._$position < 10;
            };
            enumerator.getCurrent = () => {
                return items[enumerator._$position];
            };

            collection.getEnumerator = () => {
                return enumerator;
            };

            const iteratedIndices = [];
            VirtualScrollHideController.each(collection, (_item, index) => {
                return iteratedIndices.push(index);
            });

            expect(iteratedIndices).toEqual([1, 2, 5, 6, 7]);
        });
    });

    describe('isItemAtIndexHidden()', () => {
        it('returns true if item is hidden', () => {
            const collection = makeCollection();

            collection._$viewIterator = {
                data: {
                    startIndex: 10,
                    stopIndex: 25,
                },
            };

            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 5)
            ).toBe(true);
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 30)
            ).toBe(true);
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 17)
            ).toBe(false);

            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 10)
            ).toBe(false);
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 25)
            ).toBe(true);

            collection.at(0).isRenderedOutsideRange = () => {
                return false;
            };
            collection.at(5).isRenderedOutsideRange = () => {
                return true;
            };
            collection.at(30).isRenderedOutsideRange = () => {
                return true;
            };
            collection.at(35).isRenderedOutsideRange = () => {
                return false;
            };

            // Ближние к границам диапазона застиканные записи должны быть видны.
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 5)
            ).toBe(false);
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 30)
            ).toBe(false);

            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 0)
            ).toBe(true);
            expect(
                VirtualScrollHideController.isItemAtIndexHidden(collection, 35)
            ).toBe(true);
        });
    });
});
