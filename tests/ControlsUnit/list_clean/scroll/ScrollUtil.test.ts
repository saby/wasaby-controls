import {
    getCalcMode,
    getScrollMode,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollUtil';

describe('Controls/_baseList/Controllers/ScrollUtil', () => {
    describe('getCalcMode', () => {
        it('should return "shift" if itemsLoadedByTrigger=true', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: true,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('shift');
        });

        it(
            'should return "nothing" if portionedLoading=true and virtual page is filled ' +
                'and not scrolled to edge',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 5,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: false,
                    scrolledToForwardEdge: false,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: true,
                    portionedLoading: true,
                };

                expect(getCalcMode(params)).toEqual('nothing');
            }
        );

        it(
            'should return "shift" if portionedLoading=true and virtual page is filled ' +
                'and scrolled to backward edge',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 5,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: true,
                    scrolledToForwardEdge: false,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: true,
                    portionedLoading: true,
                };

                assert.equal(getCalcMode(params), 'shift');
            }
        );

        it(
            'should return "shift" if portionedLoading=true and virtual page is filled ' +
                'and scrolled to forward edge',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 5,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: false,
                    scrolledToForwardEdge: true,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: true,
                    portionedLoading: true,
                };

                assert.equal(getCalcMode(params), 'shift');
            }
        );

        it('should return "shift" if portionedLoading=true and virtual page is not filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: true,
                portionedLoading: true,
            };

            expect(getCalcMode(params)).toEqual('shift');
        });

        it('should return "nothing" if scrolledToBackwardEdge=true and virtual page is filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('nothing');
        });

        it('should return "extend" if scrolledToBackwardEdge=true and virtual page is not filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('extend');
        });

        it('should return "shift" if scrolledToForwardEdge=true and virtual page is filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('shift');
        });

        it('should return "extend" if scrolledToForwardEdge=true and virtual page is not filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('extend');
        });

        it('should return "shift" if scrolledToForwardEdge=true and add items to end', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 6,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('shift');
        });

        it('should return "nothing" if list is scrolled to middle and virtual page is filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('nothing');
        });

        it('should return "shift" if list is scrolled to middle and virtual page is not filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getCalcMode(params)).toEqual('shift');
        });
    });

    describe('getScrollMode', () => {
        it('should return "fixed" if itemsLoadedByTrigger=true', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: true,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it(
            'should return "fixed" if itemsLoadedByTrigger=true, ' +
                'portionedLoading=true, scrolledToBackwardEdge=true',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 5,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: true,
                    scrolledToForwardEdge: false,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: true,
                    portionedLoading: true,
                };

                expect(getScrollMode(params)).toEqual('fixed');
            }
        );

        it('should return "unfixed" if scrolledToBackwardEdge=true', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('unfixed');
        });

        it('should return "fixed" if scrolledToBackwardEdge=true, scrolledToForwardEdge=true, portionedLoading=true', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 10,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: true,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: true,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it('should return "unfixed" if scrolledToBackwardEdge=true, scrolledToForwardEdge=true', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 10,
                scrolledToBackwardEdge: true,
                scrolledToForwardEdge: true,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('unfixed');
        });

        it('should return "fixed" if scrolledToForwardEdge=true and add items to middle', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 4,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 2,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it('should return "fixed" if scrolledToForwardEdge=true and add items to end', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 3,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 3,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it(
            'should return "fixed" ' +
                'if scrolledToForwardEdge=true, add items to end and portionedLoading=true',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 3,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: false,
                    scrolledToForwardEdge: true,
                    newItemsIndex: 3,
                    itemsLoadedByTrigger: false,
                    portionedLoading: true,
                };

                expect(getScrollMode(params)).toEqual('fixed');
            }
        );

        it(
            'should return "unfixed" ' +
                'if scrolledToForwardEdge=true, add items to start, virtual page is filled',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 3,
                    },
                    virtualPageSize: 3,
                    scrolledToBackwardEdge: false,
                    scrolledToForwardEdge: true,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: false,
                    portionedLoading: false,
                };

                expect(getScrollMode(params)).toEqual('unfixed');
            }
        );

        it(
            'should return "unfixed" if scrolledToForwardEdge=true and ' +
                'add items to start, virtual page is filled',
            () => {
                const params = {
                    range: {
                        startIndex: 0,
                        endIndex: 5,
                    },
                    virtualPageSize: 5,
                    scrolledToBackwardEdge: false,
                    scrolledToForwardEdge: true,
                    newItemsIndex: 0,
                    itemsLoadedByTrigger: false,
                    portionedLoading: false,
                };

                expect(getScrollMode(params)).toEqual('unfixed');
            }
        );

        it('should return "fixed" if scrolledToForwardEdge=true and add items to end, virtual page is filled', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: true,
                newItemsIndex: 5,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it('should return "fixed" if list scrolled to middle and virtual page is filled, add items to start', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 0,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it('should return "fixed" if list scrolled to middle and virtual page is filled, add items to middle', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 3,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });

        it('should return "fixed" if list scrolled to middle and virtual page is filled, add items to end', () => {
            const params = {
                range: {
                    startIndex: 0,
                    endIndex: 5,
                },
                virtualPageSize: 5,
                scrolledToBackwardEdge: false,
                scrolledToForwardEdge: false,
                newItemsIndex: 5,
                itemsLoadedByTrigger: false,
                portionedLoading: false,
            };

            expect(getScrollMode(params)).toEqual('fixed');
        });
    });
});
