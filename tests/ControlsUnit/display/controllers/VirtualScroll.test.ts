import * as VirtualScrollController from 'Controls/_display/controllers/VirtualScroll';

const COUNT = 100;

describe('Controls/_display/controllers/VirtualScroll', () => {
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
                return enumerator._$position < COUNT;
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

            _$count: COUNT,
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
        };
        return collection;
    }

    describe('setup()', () => {
        it('sets view iterator with required fields', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);

            expect(typeof collection._$viewIterator.each).toBe('function');
            expect(typeof collection._$viewIterator.setIndices).toBe('function');
            expect(typeof collection._$viewIterator.isItemAtIndexHidden).toBe('function');

            const { startIndex, stopIndex } = collection._$viewIterator.data;
            expect(startIndex).toBe(0);
            expect(stopIndex).toBe(100);

            expect(collection._$version).toBe(0);
        });
    });

    describe('setIndices()', () => {
        it('changes the start and stop index and increases version', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);

            VirtualScrollController.setIndices(collection, 2, 5);

            const { startIndex, stopIndex } = collection._$viewIterator.data;
            expect(startIndex).toBe(2);
            expect(stopIndex).toBe(5);
            expect(collection._$version).toBe(1);

            VirtualScrollController.setIndices(collection, 2, 5);
            expect(collection._$version).toBe(1);
        });
    });

    describe('each()', () => {
        it('iterates over each item once with correct indices', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);
            VirtualScrollController.setIndices(collection, 5, 10);

            const enumerator = makeEnumerator();
            collection.getEnumerator = () => {
                return enumerator;
            };

            const iteratedIndices = [];
            VirtualScrollController.each(collection, (_item, index) => {
                return iteratedIndices.push(index);
            });

            expect(iteratedIndices).toEqual([5, 6, 7, 8, 9]);
        });
        it('iterates over each item once with correct indices with sticked items', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);
            VirtualScrollController.setIndices(collection, 5, 10);

            const enumerator = makeEnumerator();

            // 1, 7 и 15 записи застиканы и должны участвовать в обходе.
            // 7 должна быть только 1 раз.
            // При этом, с тех сторон, где есть застканные записи, нужно убрать лишние записи
            enumerator.getCurrent = () => {
                if (
                    enumerator._$position === 1 ||
                    enumerator._$position === 7 ||
                    enumerator._$position === 15
                ) {
                    return {
                        StickableItem: true,
                        isSticked: () => {
                            return true;
                        },
                        setRenderedOutsideRange: () => {
                            return null;
                        },
                        isRenderedOutsideRange: () => {
                            return true;
                        },
                    };
                }
            };
            collection.getEnumerator = () => {
                return enumerator;
            };

            const iteratedIndices = [];
            VirtualScrollController.each(collection, (_item, index) => {
                return iteratedIndices.push(index);
            });

            expect(iteratedIndices).toEqual([1, 5, 6, 7, 8, 9, 15]);
        });
        it('iterates over each item once with correct indices with editing item', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);
            VirtualScrollController.setIndices(collection, 5, 10);

            const enumerator = makeEnumerator();

            // 1я запись редактируется и должна участвовать в обходе.
            // При этом, с тех сторон, где есть застканные записи, нужно убрать лишние записи
            enumerator.getCurrent = () => {
                if (enumerator._$position === 1) {
                    return {
                        StickableItem: false,
                        EditableItem: true,
                        isEditing: () => {
                            return true;
                        },
                        setRenderedOutsideRange: () => {
                            return null;
                        },
                        isRenderedOutsideRange: () => {
                            return true;
                        },
                    };
                }
            };
            collection.getEnumerator = () => {
                return enumerator;
            };

            const iteratedIndices = [];
            VirtualScrollController.each(collection, (_item, index) => {
                return iteratedIndices.push(index);
            });

            expect(iteratedIndices).toEqual([1, 5, 6, 7, 8, 9]);
        });
        it('iterates over each item once with correct indices with sticky group', () => {
            const collection = makeCollection();

            VirtualScrollController.setup(collection);
            VirtualScrollController.setIndices(collection, 5, 10);

            const enumerator = makeEnumerator();

            // 1 запись - застиканная группа. Группу выводим, лишние записи не убираем.
            // https://online.sbis.ru/opendoc.html?guid=d3f8f3a4-e7cf-40e5-9dee-e415b0db5b03
            enumerator.getCurrent = () => {
                if (enumerator._$position === 1) {
                    return {
                        '[Controls/_display/GroupItem]': true,
                        StickableItem: true,
                        isSticked: () => {
                            return true;
                        },
                        setRenderedOutsideRange: () => {
                            return null;
                        },
                        isRenderedOutsideRange: () => {
                            return true;
                        },
                    };
                }
            };
            collection.getEnumerator = () => {
                return enumerator;
            };

            const iteratedIndices = [];
            VirtualScrollController.each(collection, (_item, index) => {
                return iteratedIndices.push(index);
            });

            expect(iteratedIndices).toEqual([1, 5, 6, 7, 8, 9]);
        });
    });

    describe('getStartIndex()', () => {
        it('returns start index', () => {
            const collection = makeCollection();

            collection._$viewIterator = {
                data: { startIndex: 10 },
            };

            expect(VirtualScrollController.getStartIndex(collection)).toBe(10);
        });
    });

    describe('getStopIndex()', () => {
        it('returns stop index', () => {
            const collection = makeCollection();

            collection._$viewIterator = {
                data: { stopIndex: 25 },
            };

            expect(VirtualScrollController.getStopIndex(collection)).toBe(25);
        });
    });
});
