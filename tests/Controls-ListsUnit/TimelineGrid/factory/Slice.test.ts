import { TimelineGridSlice, IRange, getAvailableRanges } from 'Controls-Lists/timelineGrid';
import { RecordSet } from 'Types/collection';
import { adapter } from 'Types/entity';
import { Memory } from 'Types/source';
import { isEqual } from 'Types/object';

describe('Controls-ListsUnit/TimelineGrid/factory/Slice', () => {
    let range: IRange;
    let loadResult;
    let config;

    beforeEach(() => {
        range = {
            start: new Date(2023, 11, 7, 0, 0, 0, 0),
            end: new Date(2023, 11, 15, 0, 0, 0, 0),
        };

        loadResult = {
            items: new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 1,
                        type: null,
                        parent: null,
                        dynamicColumns: new RecordSet({
                            keyProperty: 'date',
                            rawData: [
                                {
                                    date: new Date(2023, 11, 7, 0, 0, 0, 0),
                                    value: 'day-7',
                                },
                                {
                                    date: new Date(2023, 11, 8, 0, 0, 0, 0),
                                    value: 'day-8',
                                },
                                {
                                    date: new Date(2023, 11, 9, 0, 0, 0, 0),
                                    value: 'day-9',
                                },
                                {
                                    date: new Date(2023, 11, 10, 0, 0, 0, 0),
                                    value: 'day-10',
                                },
                                {
                                    date: new Date(2023, 11, 11, 0, 0, 0, 0),
                                    value: 'day-11',
                                },
                                {
                                    date: new Date(2023, 11, 12, 0, 0, 0, 0),
                                    value: 'day-12',
                                },
                                {
                                    date: new Date(2023, 11, 13, 0, 0, 0, 0),
                                    value: 'day-13',
                                },
                                {
                                    date: new Date(2023, 11, 14, 0, 0, 0, 0),
                                    value: 'day-14',
                                },
                                {
                                    date: new Date(2023, 11, 15, 0, 0, 0, 0),
                                    value: 'day-15',
                                },
                            ],
                        }),
                        events: new RecordSet({
                            keyProperty: 'date',
                            rawData: [],
                        }),
                    },
                ],
            }),
        };

        config = {
            source: new Memory({
                keyProperty: 'key',
                adapter: new adapter.Json(),
            }),
            range,
            columnsNavigation: {
                sourceConfig: {
                    field: 'date',
                },
            },
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            staticColumns: [{}],
            dynamicColumn: {},
            staticHeaders: [{}],
            dynamicHeader: {},
            eventsProperty: 'events',
        };
    });

    test('constructor and getters', () => {
        const slice = new TimelineGridSlice({
            loadResult,
            onChange: () => {},
            config,
        });

        expect(slice.state.items).toEqual(loadResult.items);

        expect(slice.range).toEqual(slice.state.range);
        expect(slice.visibleRange).toEqual(slice.state.visibleRange);
        expect(slice.availableRanges).toEqual(slice.state.availableRanges);
        expect(slice.loadRange).toEqual(slice.state.loadRange);
    });

    test('load forward (first and second calls)', () => {
        // Загрузка запускается после setRange, а тут важно проверить, что поменялся visibleRange и dynamicColumnsGridData

        const expectedValues = [
            {
                visibleRange: {
                    start: new Date(2023, 11, 7, 0, 0, 0, 0),
                    end: new Date(2023, 11, 16, 0, 0, 0, 0),
                },
                columnsDataVersion: 1,
                dynamicColumnsGridDataCount: 27,
                dynamicColumnsGridDataStart: new Date(2023, 10, 28, 0, 0, 0, 0),
                dynamicColumnsGridDataEnd: new Date(2023, 11, 24, 0, 0, 0, 0),
            },
            {
                visibleRange: {
                    start: new Date(2023, 11, 16, 0, 0, 0, 0),
                    end: new Date(2023, 11, 25, 0, 0, 0, 0),
                },
                columnsDataVersion: 2,
                dynamicColumnsGridDataCount: 27,
                dynamicColumnsGridDataStart: new Date(2023, 11, 7, 0, 0, 0, 0),
                dynamicColumnsGridDataEnd: new Date(2024, 0, 2, 0, 0, 0, 0),
            },
        ];

        const onChangeRef: {
            current: (state) => void;
        } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            // Загрузка запускается после setRange, а тут важно проверить, что поменялся visibleRange и dynamicColumnsGridData
            const slice = new TimelineGridSlice({
                loadResult,
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config,
            });

            onChangeRef.current = (newState) => {
                if (newState.columnsDataVersion === 1) {
                    resolve1(slice);
                }
            };
            slice.loadForwardColumns();
        }).then((slice) => {
            expect(slice.visibleRange).toEqual(expectedValues[0].visibleRange);
            expect(slice.columnsDataVersion).toEqual(expectedValues[0].columnsDataVersion);
            expect(slice.dynamicColumnsGridData).toHaveLength(
                expectedValues[0].dynamicColumnsGridDataCount
            );
            expect(slice.dynamicColumnsGridData.at(0)).toEqual(
                expectedValues[0].dynamicColumnsGridDataStart
            );
            expect(slice.dynamicColumnsGridData.at(-1)).toEqual(
                expectedValues[0].dynamicColumnsGridDataEnd
            );

            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    if (newState.columnsDataVersion === 2) {
                        resolve2(slice);
                    }
                };

                slice.loadForwardColumns();
            }).then((slice) => {
                expect(slice.visibleRange).toEqual(expectedValues[1].visibleRange);
                expect(slice.columnsDataVersion).toEqual(expectedValues[1].columnsDataVersion);
                expect(slice.dynamicColumnsGridData).toHaveLength(
                    expectedValues[1].dynamicColumnsGridDataCount
                );
                expect(slice.dynamicColumnsGridData.at(0)).toEqual(
                    expectedValues[1].dynamicColumnsGridDataStart
                );
                expect(slice.dynamicColumnsGridData.at(-1)).toEqual(
                    expectedValues[1].dynamicColumnsGridDataEnd
                );
            });
        });
    });

    test('load backward (first and second calls)', () => {
        // Симметричный тест (см. предыдущий), только загрузка в другую сторону
        const slice = new TimelineGridSlice({
            loadResult,
            onChange: () => {},
            config,
        });

        const expectedValues = [
            {
                visibleRange: {
                    start: new Date(2023, 10, 19, 0, 0, 0, 0),
                    end: new Date(2023, 10, 28, 0, 0, 0, 0),
                },
                columnsDataVersion: 1,
                dynamicColumnsGridDataCount: 27,
                dynamicColumnsGridDataStart: new Date(2023, 10, 10, 0, 0, 0, 0),
                dynamicColumnsGridDataEnd: new Date(2023, 11, 6, 0, 0, 0, 0),
            },
            {
                visibleRange: {
                    start: new Date(2023, 10, 10, 0, 0, 0, 0),
                    end: new Date(2023, 10, 19, 0, 0, 0, 0),
                },
                columnsDataVersion: 2,
                dynamicColumnsGridDataCount: 27,
                dynamicColumnsGridDataStart: new Date(2023, 10, 1, 0, 0, 0, 0),
                dynamicColumnsGridDataEnd: new Date(2023, 10, 27, 0, 0, 0, 0),
            },
        ];

        const onChangeRef: {
            current: (state) => void;
        } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            // Загрузка запускается после setRange, а тут важно проверить, что поменялся visibleRange и dynamicColumnsGridData
            const slice = new TimelineGridSlice({
                loadResult,
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config,
            });

            onChangeRef.current = (newState) => {
                if (newState.columnsDataVersion === 1) {
                    resolve1(slice);
                }
            };

            slice.loadBackwardColumns();
        }).then((slice) => {
            expect(slice.visibleRange).toEqual(expectedValues[0].visibleRange);
            expect(slice.columnsDataVersion).toEqual(expectedValues[0].columnsDataVersion);
            expect(slice.dynamicColumnsGridData).toHaveLength(
                expectedValues[0].dynamicColumnsGridDataCount
            );
            expect(slice.dynamicColumnsGridData.at(0)).toEqual(
                expectedValues[0].dynamicColumnsGridDataStart
            );
            expect(slice.dynamicColumnsGridData.at(-1)).toEqual(
                expectedValues[0].dynamicColumnsGridDataEnd
            );

            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    if (newState.columnsDataVersion === 2) {
                        resolve2(slice);
                    }
                };

                slice.loadBackwardColumns();
            }).then((slice) => {
                expect(slice.visibleRange).toEqual(expectedValues[1].visibleRange);
                expect(slice.columnsDataVersion).toEqual(expectedValues[1].columnsDataVersion);
                expect(slice.dynamicColumnsGridData).toHaveLength(
                    expectedValues[1].dynamicColumnsGridDataCount
                );
                expect(slice.dynamicColumnsGridData.at(0)).toEqual(
                    expectedValues[1].dynamicColumnsGridDataStart
                );
                expect(slice.dynamicColumnsGridData.at(-1)).toEqual(
                    expectedValues[1].dynamicColumnsGridDataEnd
                );
            });
        });
    });

    test('changing loading direction (double load forward and load backward)', () => {
        // Тест смены направления загрузки

        const expectedValues = [
            {
                visibleRange: {
                    start: new Date(2023, 11, 7, 0, 0, 0, 0),
                    end: new Date(2023, 11, 16, 0, 0, 0, 0),
                },
                columnsDataVersion: 3,
                dynamicColumnsGridDataCount: 27,
                dynamicColumnsGridDataStart: new Date(2023, 10, 28, 0, 0, 0, 0),
                dynamicColumnsGridDataEnd: new Date(2023, 11, 24, 0, 0, 0, 0),
            },
        ];

        const onChangeRef: {
            current: (state) => void;
        } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            const slice = new TimelineGridSlice({
                loadResult,
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config,
            });

            onChangeRef.current = (newState) => {
                if (newState.columnsDataVersion === 1) {
                    resolve1(slice);
                }
            };

            slice.loadForwardColumns();
        }).then((slice) => {
            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    if (newState.columnsDataVersion === 2) {
                        resolve2(slice);
                    }
                };

                slice.loadForwardColumns();
            }).then((slice) => {
                return new Promise((resolve3) => {
                    onChangeRef.current = (newState) => {
                        if (newState.columnsDataVersion === 3) {
                            resolve3(slice);
                        }
                    };

                    slice.loadBackwardColumns();
                }).then((slice) => {
                    expect(slice.visibleRange).toEqual(expectedValues[0].visibleRange);
                    expect(slice.columnsDataVersion).toEqual(expectedValues[0].columnsDataVersion);
                    expect(slice.dynamicColumnsGridData).toHaveLength(
                        expectedValues[0].dynamicColumnsGridDataCount
                    );
                    expect(slice.dynamicColumnsGridData.at(0)).toEqual(
                        expectedValues[0].dynamicColumnsGridDataStart
                    );
                    expect(slice.dynamicColumnsGridData.at(-1)).toEqual(
                        expectedValues[0].dynamicColumnsGridDataEnd
                    );
                });
            });
        });
    });

    test('call loading by change range', async () => {
        const expectedDate = {
            direction: 'forward',
            position: '2023-12-08 00:00:00+03',
            limit: 9,
            quantum: 'day',
            scale: 1,
        };

        const spiedQuery = jest.spyOn(Memory.prototype, 'query');

        let changeResolvePromise = null;

        const slice = new TimelineGridSlice({
            loadResult,
            onChange: (newState) => {
                if (changeResolvePromise && !isEqual(range, newState.range)) {
                    changeResolvePromise();
                }
            },
            config,
        });

        await new Promise((resolver) => {
            changeResolvePromise = resolver;
            slice.setRange({
                start: new Date(2023, 11, 8, 0, 0, 0, 0),
                end: new Date(2023, 11, 16, 0, 0, 0, 0),
            });
        }).then(() => {
            expect(spiedQuery).toHaveBeenCalledTimes(1);

            const date = spiedQuery.mock.lastCall[0].getWhere().date.getRawData();
            expect(date).toEqual(expectedDate);

            spiedQuery.mockClear();
        });
    });

    test('do not call loading for equal range', () => {
        const slice = new TimelineGridSlice({
            loadResult,
            config,
        });

        const onChangeFn = jest.fn(slice.setState);

        slice.setRange({
            start: new Date(2023, 11, 7, 0, 0, 0, 0),
            end: new Date(2023, 11, 15, 0, 0, 0, 0),
        });

        expect(onChangeFn).toHaveBeenCalledTimes(0);
    });

    test('setAvailableRanges', () => {
        const onChangeFn = jest.fn();

        const availableRanges = getAvailableRanges(1000, config.dynamicColumn, 3, false, 30);

        return new Promise((resolve1) => {
            const slice = new TimelineGridSlice({
                loadResult,
                onChange: (newState) => {
                    onChangeFn();
                    resolve1(slice);
                },
                config,
            });

            slice.setAvailableRanges(availableRanges);
        }).then((slice) => {
            expect(onChangeFn).toHaveBeenCalledTimes(1);
        });
    });
});
