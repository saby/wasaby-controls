import DisplayEnumerator from 'Controls/_display/CollectionEnumerator';

describe('Controls/_display/CollectionEnumerator', () => {
    interface IItem {
        index: number;
    }

    let items: IItem[];
    let filterMap: boolean[];
    let sortMap: number[];
    let enumerator: DisplayEnumerator<IItem>;

    beforeEach(() => {
        items = [
            {
                index: 0,
            },
            {
                index: 1,
            },
            {
                index: 2,
            },
            {
                index: 3,
            },
            {
                index: 4,
            },
        ];

        filterMap = [true, true, true, true, true];

        sortMap = [0, 1, 2, 3, 4];

        enumerator = new DisplayEnumerator({
            items,
            filterMap,
            sortMap,
        });
    });

    afterEach(() => {
        enumerator = undefined;
        items = undefined;
        filterMap = undefined;
        sortMap = undefined;
    });

    describe('constructor()', () => {
        it('should throw an error on invalid argument', () => {
            let display;

            expect(() => {
                display = new DisplayEnumerator({
                    items: {},
                    filterMap: {},
                    sortMap: {},
                });
            }).toThrow();
            expect(() => {
                display = new DisplayEnumerator({
                    items: '',
                    filterMap: '',
                    sortMap: '',
                });
            }).toThrow();
            expect(() => {
                display = new DisplayEnumerator({
                    items: 0,
                    filterMap: 1,
                    sortMap: 2,
                });
            }).toThrow();
            expect(() => {
                display = new DisplayEnumerator({
                    items: undefined,
                    filterMap: undefined,
                    sortMap: undefined,
                });
            }).toThrow();
            expect(() => {
                display = new DisplayEnumerator({
                    items: [],
                    filterMap: undefined,
                    sortMap: undefined,
                });
            }).toThrow();
            expect(() => {
                display = new DisplayEnumerator({
                    items: [],
                    filterMap: [],
                    sortMap: undefined,
                });
            }).toThrow();

            expect(display).not.toBeDefined();
        });
    });

    describe('.getCurrent()', () => {
        it('should return undefined by default', () => {
            expect(enumerator.getCurrent()).not.toBeDefined();
        });

        it('should return item by item', () => {
            let index = -1;
            while (enumerator.moveNext()) {
                index++;
                expect(items[index]).toBe(enumerator.getCurrent());
            }
            expect(items[items.length - 1]).toBe(enumerator.getCurrent());
        });
    });

    describe('.moveNext()', () => {
        it('should return undefined for empty list', () => {
            const enumerator = new DisplayEnumerator();
            expect(enumerator.moveNext()).toBe(false);
            expect(enumerator.getCurrent()).not.toBeDefined();
        });

        it('should return item by item', () => {
            let index = -1;
            while (enumerator.moveNext()) {
                const item = enumerator.getCurrent();
                index++;
                expect(items[index]).toBe(item);
            }
            expect(enumerator.moveNext()).toBe(false);
        });

        it('should work fine with repeated elements', () => {
            const items = ['a', 'b', 'c', 'd', 'e'];
            const sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3];
            const enumerator = new DisplayEnumerator({
                items,
                filterMap: [true, true, true, true, true],
                sortMap,
            });

            let index = -1;
            while (enumerator.moveNext()) {
                const item = enumerator.getCurrent();
                index++;
                const itemIndex = sortMap[index];
                expect(items[itemIndex]).toBe(item);
            }
            expect(index).toBe(sortMap.length - 1);
        });
    });

    describe('.getPrevious()', () => {
        it('should return undefined for empty list', () => {
            const enumerator = new DisplayEnumerator();
            expect(enumerator.movePrevious()).toBe(false);
            expect(enumerator.getCurrent()).not.toBeDefined();
        });

        it('should return item by item', () => {
            let index = items.length - 1;
            enumerator.setPosition(index);
            while (enumerator.movePrevious()) {
                const item = enumerator.getCurrent();
                index--;
                expect(items[index]).toBe(item);
            }
            expect(enumerator.movePrevious()).toBe(false);
        });
    });

    describe('.reset()', () => {
        it('should set current to undefined', () => {
            enumerator.moveNext();
            expect(enumerator.getCurrent()).toBeDefined();
            enumerator.reset();
            expect(enumerator.getCurrent()).not.toBeDefined();
        });

        it('should start enumeration from beginning', () => {
            enumerator.moveNext();
            const firstOne = enumerator.getCurrent();
            enumerator.moveNext();
            enumerator.reset();
            enumerator.moveNext();
            expect(firstOne).toBe(enumerator.getCurrent());

            enumerator.reset();
            let index = -1;
            while (enumerator.moveNext()) {
                index++;
                expect(items[index]).toBe(enumerator.getCurrent());
            }
        });
    });

    describe('.at()', () => {
        it('should return element at given position', () => {
            for (let index = 0; index < sortMap.length; index++) {
                const itemIndex = sortMap[index];
                expect(items[itemIndex]).toBe(enumerator.at(index));
            }
        });
    });

    describe('.getCount()', () => {
        it('should return value equal to items count', () => {
            expect(items.length).toBe(enumerator.getCount());
        });

        it('should return value equal to sort map count', () => {
            const items = ['a', 'b', 'c', 'd', 'e'];
            const sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3];
            const filterMap = [true, true, true, true, true];
            const enumerator = new DisplayEnumerator({
                items,
                filterMap,
                sortMap,
            });

            expect(sortMap.length).toBe(enumerator.getCount());
        });

        it('should return value equal to sort map count reduced by filter map', () => {
            const items = ['a', 'b', 'c', 'd', 'e'];
            const sortMap = [0, 1, 2, 1, 3, 4, 2, 4, 0, 0, 4, 3];
            const filterMap = [true, false, true, true, false];
            const expectedCount = sortMap.reduce((prev, cur) => {
                const match = filterMap[cur];
                return prev + (match ? 1 : 0);
            }, 0);
            enumerator = new DisplayEnumerator({
                items,
                filterMap,
                sortMap,
            });

            expect(expectedCount).toBe(enumerator.getCount());
        });
    });

    describe('.getIndexByValue()', () => {
        it('should save the position unchanged', () => {
            const position = 1;
            enumerator.setPosition(position);
            enumerator.getIndexByValue('index', 999);
            expect(enumerator.getPosition()).toBe(position);
        });

        it('should save the current unchanged', () => {
            enumerator.setPosition(1);
            const current = enumerator.getCurrent();
            enumerator.getIndexByValue('index', 999);
            expect(enumerator.getCurrent()).toBe(current);
        });
    });

    describe('.getPosition()', () => {
        it('should return -1 by default', () => {
            expect(-1).toBe(enumerator.getPosition());
        });

        it('should change through navigation', () => {
            let index = -1;
            while (enumerator.moveNext()) {
                index++;
                expect(index).toBe(enumerator.getPosition());
            }
            expect(items.length - 1).toBe(enumerator.getPosition());

            while (enumerator.movePrevious()) {
                index--;
                expect(index).toBe(enumerator.getPosition());
            }
            expect(0).toBe(enumerator.getPosition());
        });
    });

    describe('.setPosition()', () => {
        it('should change the position', () => {
            enumerator.setPosition(0);
            expect(0).toBe(enumerator.getPosition());

            enumerator.setPosition(4);
            expect(4).toBe(enumerator.getPosition());

            enumerator.setPosition(-1);
            expect(-1).toBe(enumerator.getPosition());
        });

        it('should change the current item', () => {
            for (let i = 0; i < items.length; i++) {
                enumerator.setPosition(i);
                expect(items[i]).toBe(enumerator.getCurrent());
            }
        });

        it('should throw an error on invalid index', () => {
            expect(() => {
                enumerator.setPosition(-2);
            }).toThrow();
            expect(() => {
                enumerator.setPosition(items.length);
            }).toThrow();
        });
    });

    describe('.reIndex()', () => {
        const sortReverse = [4, 3, 2, 1, 0];

        const tests = [
            {
                // 0
                goto: -1,
                hide: [],
                sort: [],
                remove: [0],
                expect: {
                    position: -1,
                    current: false,
                    next: 1,
                    previous: -1,
                    posToOriginal: {
                        0: 1,
                        1: 2,
                    },
                },
            },
            {
                // 1
                goto: 0,
                hide: [],
                sort: [],
                remove: [0],
                expect: {
                    position: -1,
                    current: false,
                    next: 1,
                    previous: -1,
                },
            },
            {
                // 2
                goto: 1,
                hide: [],
                sort: [],
                remove: [0],
                expect: {
                    position: 0,
                    current: true,
                    next: 2,
                    previous: -1,
                },
            },
            {
                // 3
                goto: 4,
                hide: [],
                sort: [],
                remove: [3],
                expect: {
                    position: 3,
                    current: true,
                    next: -1,
                    previous: 2,
                    posToOriginal: {
                        2: 2,
                        3: 4,
                    },
                },
            },
            {
                // 4
                goto: 1,
                hide: [],
                sort: [],
                remove: [2],
                expect: {
                    position: 1,
                    current: true,
                    next: 3,
                    previous: 0,
                    posToOriginal: {
                        0: 0,
                        1: 1,
                        2: 3,
                    },
                },
            },
            {
                // 5
                goto: -1,
                hide: [0],
                sort: [],
                remove: [],
                expect: {
                    position: -1,
                    current: false,
                    next: 1,
                    previous: -1,
                    posToOriginal: {
                        0: 1,
                        1: 2,
                    },
                },
            },
            {
                // 6
                goto: 0,
                hide: [0],
                sort: [],
                remove: [],
                expect: {
                    position: -1,
                    current: false,
                    next: 1,
                    previous: -1,
                },
            },
            {
                // 7
                goto: 1,
                hide: [0],
                sort: [],
                remove: [],
                expect: {
                    position: 0,
                    current: true,
                    next: 2,
                    previous: -1,
                },
            },
            {
                // 8
                goto: 4,
                hide: [3],
                sort: [],
                remove: [],
                expect: {
                    position: 3,
                    current: true,
                    next: -1,
                    previous: 2,
                    posToOriginal: {
                        2: 2,
                        3: 4,
                    },
                },
            },
            {
                // 9
                goto: 1,
                hide: [2],
                sort: [],
                remove: [],
                expect: {
                    position: 1,
                    current: true,
                    next: 3,
                    previous: 0,
                    posToOriginal: {
                        0: 0,
                        1: 1,
                        2: 3,
                    },
                },
            },
            {
                // 10
                goto: -1,
                hide: [1],
                sort: [],
                remove: [0],
                expect: {
                    position: -1,
                    current: false,
                    next: 2,
                    previous: -1,
                    posToOriginal: {
                        0: 2,
                        1: 3,
                    },
                },
            },
            {
                // 11
                goto: 0,
                hide: [1],
                sort: [],
                remove: [0],
                expect: {
                    position: -1,
                    current: false,
                    next: 2,
                    previous: -1,
                },
            },
            {
                // 12
                goto: 1,
                hide: [1],
                sort: [],
                remove: [0],
                expect: {
                    position: -1,
                    current: false,
                    next: 2,
                    previous: -1,
                },
            },
            {
                // 13
                goto: 2,
                hide: [1],
                sort: [],
                remove: [0],
                expect: {
                    position: 0,
                    current: true,
                    next: 3,
                    previous: -1,
                },
            },
            {
                // 14
                goto: 1,
                hide: [2],
                sort: [],
                remove: [0],
                expect: {
                    position: 0,
                    current: true,
                    next: 3,
                    previous: -1,
                    posToOriginal: {
                        0: 1,
                        1: 3,
                        2: 4,
                    },
                },
            },
            {
                // 15
                goto: 2,
                hide: [1, 2, 3],
                sort: [],
                remove: [],
                expect: {
                    position: -1,
                    current: false,
                    next: 0,
                    previous: -1,
                    posToOriginal: {
                        0: 0,
                        1: 4,
                    },
                },
            },
            {
                // 16
                goto: 2,
                hide: [1, 3],
                sort: [],
                remove: [],
                expect: {
                    position: 1,
                    current: true,
                    next: 4,
                    previous: 0,
                    posToOriginal: {
                        0: 0,
                        1: 2,
                        2: 4,
                    },
                },
            },
            {
                // 17
                goto: -1,
                hide: [],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: -1,
                    current: false,
                    next: 4,
                    previous: -1,
                    posToOriginal: {
                        0: 4,
                        1: 3,
                        2: 2,
                        3: 1,
                        4: 0,
                    },
                },
            },
            {
                // 18
                goto: 0,
                hide: [],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: 4,
                    current: true,
                    next: -1,
                    previous: 1,
                },
            },
            {
                // 19
                goto: 1,
                hide: [],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: 3,
                    current: true,
                    next: 0,
                    previous: 2,
                },
            },
            {
                // 20
                goto: 2,
                hide: [],
                sort: [1, 3, 0, 4, 2],
                remove: [],
                expect: {
                    position: 4,
                    current: true,
                    next: -1,
                    previous: 4,
                    posToOriginal: {
                        0: 1,
                        1: 3,
                        2: 0,
                        3: 4,
                        4: 2,
                    },
                },
            },
            {
                // 21
                goto: 0,
                hide: [],
                sort: [1, 3, 0, 4, 2],
                remove: [],
                expect: {
                    position: 2,
                    current: true,
                    next: 4,
                    previous: 3,
                },
            },
            {
                // 22
                goto: 1,
                hide: [1, 2],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: -1,
                    current: false,
                    next: 4,
                    previous: -1,
                },
            },
            {
                // 23
                goto: 3,
                hide: [1, 2, 4],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: 0,
                    current: true,
                    next: 0,
                    previous: -1,
                },
            },
            {
                // 24
                goto: 2,
                hide: [1, 3],
                sort: sortReverse,
                remove: [],
                expect: {
                    position: 1,
                    current: true,
                    next: 0,
                    previous: 4,
                },
            },
        ];

        for (let testNum = 0; testNum < tests.length; testNum++) {
            ((test) => {
                let original;

                describe(
                    `${testNum}: when ` +
                        (test.goto > -1 ? `goto #${test.goto}, ` : '') +
                        (test.sort.length
                            ? `sort [${test.sort.join(',')}], `
                            : '') +
                        (test.hide.length
                            ? `hide [${test.hide.join(',')}], `
                            : '') +
                        (test.remove.length
                            ? `remove [${test.remove.join(',')}]`
                            : ''),
                    () => {
                        beforeEach(() => {
                            original = items.slice();

                            if (test.goto > -1) {
                                enumerator.setPosition(test.goto);
                            }

                            if (test.hide.length) {
                                for (
                                    let hideNum = 0;
                                    hideNum < test.hide.length;
                                    hideNum++
                                ) {
                                    filterMap[test.hide[hideNum]] = false;
                                }
                            }

                            if (test.sort.length) {
                                Array.prototype.splice.apply(
                                    sortMap,
                                    [0, sortMap.length].concat(test.sort)
                                );
                            }

                            if (test.remove.length) {
                                for (
                                    let removeNum = 0;
                                    removeNum < test.remove.length;
                                    removeNum++
                                ) {
                                    const index = test.remove[removeNum];
                                    items.splice(index, 1);
                                    filterMap.splice(index, 1);
                                    const sortIndex = sortMap.indexOf(index);
                                    if (sortIndex > -1) {
                                        sortMap.splice(sortIndex, 1);
                                        for (
                                            let i = 0;
                                            i < sortMap.length;
                                            i++
                                        ) {
                                            if (sortMap[i] > index) {
                                                sortMap[i]--;
                                            }
                                        }
                                    }
                                }
                            }

                            enumerator.reIndex();
                        });

                        it(`the position becomes to #${test.expect.position}`, () => {
                            expect(test.expect.position).toBe(
                                enumerator.getPosition()
                            );
                        });

                        it(`the current is ${
                            test.expect.current ? 'not changed' : 'reset'
                        }`, () => {
                            if (test.expect.current) {
                                expect(original[test.goto]).toBe(
                                    enumerator.getCurrent()
                                );
                            } else {
                                expect(
                                    enumerator.getCurrent()
                                ).not.toBeDefined();
                            }
                        });

                        const nextTitle =
                            test.expect.next === -1
                                ? 'undefined'
                                : `original[${test.expect.next}]`;
                        it(`the next is ${nextTitle}`, () => {
                            expect(original[test.expect.next]).toBe(
                                enumerator.moveNext()
                                    ? enumerator.getCurrent()
                                    : undefined
                            );
                        });

                        const previousTitle =
                            test.expect.previous === -1
                                ? 'undefined'
                                : `original[${test.expect.previous}]`;
                        it(`the previous is ${previousTitle}`, () => {
                            expect(original[test.expect.previous]).toBe(
                                enumerator.movePrevious()
                                    ? enumerator.getCurrent()
                                    : undefined
                            );
                        });

                        if (test.expect.posToOriginal) {
                            it(`positions to original is ${JSON.stringify(
                                test.expect.posToOriginal
                            )}`, () => {
                                for (const position in test.expect
                                    .posToOriginal) {
                                    if (
                                        test.expect.posToOriginal.hasOwnProperty(
                                            position
                                        )
                                    ) {
                                        enumerator.setPosition(
                                            Number(position)
                                        );
                                        expect(
                                            original[
                                                test.expect.posToOriginal[
                                                    position
                                                ]
                                            ]
                                        ).toBe(enumerator.getCurrent());
                                    }
                                }
                            });
                        }
                    }
                );
            })(tests[testNum]);
        }
    });
});
