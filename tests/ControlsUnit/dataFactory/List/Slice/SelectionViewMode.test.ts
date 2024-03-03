import { IListState, ListSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import 'Controls/search';
import 'Controls/operations';

describe('Controls/dataFactory:ListSlice тесты изменения стейта selectionViewMode при различных сценариях', () => {
    it('selectionViewMode сбрасывается при перезагрузке (вызов метода reload)', () => {
        const source = new Memory();
        const items = new RecordSet();
        const itemsVersion = items.getVersion();

        const onChangeRef: { current: (state) => void } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            const slice = new ListSlice({
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
            });

            onChangeRef.current = (newState) => {
                if (newState.selectionViewMode === 'selected') {
                    resolve1(slice);
                }
            };

            slice.setSelectionViewMode('selected');
        }).then((slice) => {
            expect(slice.state.selectionViewMode).toEqual('selected');
            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    if (itemsVersion !== newState.items.getVersion()) {
                        resolve2(slice);
                    }
                };

                slice.reload();
            }).then((state) => {
                expect(state.selectionViewMode).toEqual('hidden');
            });
        });
    });

    it('При установке selectionViewMode: selected счётчик отмеченных записей и выделение сохраняется', () => {
        const selectedKeys = [1, 2];
        const excludedKeys = [3, 4];
        const source = new Memory();
        const items = new RecordSet();
        const TEST_COUNT_VALUE = 10;

        const onChangeRef: { current: (state) => void } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            const slice = new ListSlice({
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                    selectedKeys,
                    excludedKeys,
                },
                loadResult: {
                    items,
                },
            });

            onChangeRef.current = (newState) => {
                if (newState.count === TEST_COUNT_VALUE && newState.isAllSelected === false) {
                    resolve1(slice);
                }
            };

            slice.setSelectionCount(TEST_COUNT_VALUE, false);
        }).then((slice) => {
            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    resolve2(slice);
                };

                slice.executeCommand('selected');
            }).then((slice) => {
                return new Promise((resolve3) => {
                    onChangeRef.current = (newState) => {
                        resolve3(slice);
                    };

                    slice.setSelectionViewMode('selected');
                }).then((slice) => {
                    expect(slice.state.showSelectedCount).toEqual(TEST_COUNT_VALUE);
                    expect(slice.state.listCommandsSelection).toEqual({
                        selected: selectedKeys,
                        excluded: excludedKeys,
                    });
                });
            });
        });
    });

    it('При отображении всех записей по команде "Показать все", ранее отмеченные записи не должны сбрасываться', () => {
        const source = new Memory();
        const items = new RecordSet();
        const itemsVersion = items.getVersion();
        const TEST_COUNT_VALUE = 2;

        const onChangeRef: { current: (state) => void } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            const slice = new ListSlice({
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
            });

            onChangeRef.current = (newState) => {
                if (newState.selectionViewMode === 'selected') {
                    resolve1(slice);
                }
            };

            slice.setSelectionViewMode('selected');
        }).then((slice) => {
            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    resolve2(slice);
                };

                slice.setSelectionCount(TEST_COUNT_VALUE, true);
            }).then((slice) => {
                return new Promise((resolve3) => {
                    onChangeRef.current = (newState) => {
                        resolve3(slice);
                    };

                    slice.setSelectedKeys([0, 1]);
                }).then((slice) => {
                    return new Promise((resolve4) => {
                        onChangeRef.current = (newState) => {
                            if (itemsVersion !== newState.items.getVersion()) {
                                resolve4(newState);
                            }
                        };

                        slice.setSelectionViewMode('all');
                    }).then((state) => {
                        expect(state.count).toEqual(TEST_COUNT_VALUE);
                        expect(state.selectedKeys).toEqual([0, 1]);
                        expect(state.isAllSelected).toBeFalsy();
                    });
                });
            });
        });
    });

    it('При отображении всех записей должен сброситься поиск и фильтр', () => {
        const source = new Memory();
        const items = new RecordSet();
        const onChange = () => {};
        const filterDescription = [
            {
                name: 'filterName',
                value: 'testValue',
                resetValue: null,
            },
        ];

        const querySpy = jest.spyOn(source, 'query');

        const onChangeRef: { current: (state) => void } = {
            current: undefined,
        };

        return new Promise((resolve1) => {
            const slice = new ListSlice({
                onChange: (newState) => {
                    onChangeRef.current(newState);
                },
                config: {
                    source,
                    searchParam: 'testSearchParam',
                    searchValue: 'testSearchValue',
                    filterDescription,
                },
                loadResult: {
                    items,
                },
            });

            onChangeRef.current = (newState) => {
                resolve1(slice);
            };

            slice.executeCommand('selected');
        }).then((slice) => {
            return new Promise((resolve2) => {
                onChangeRef.current = (newState) => {
                    resolve2(slice);
                };

                slice.setSelectionViewMode('selected');
            }).then((slice) => {
                expect(slice.state.searchValue).toEqual('');
                expect(slice.state.filterDescription[0].value).toEqual(
                    filterDescription[0].resetValue
                );
                expect(slice.state.filter).toEqual({ filterName: null });
                expect(slice.state.sourceController.getFilter()).toEqual({ filterName: null });
                expect(querySpy).toHaveBeenCalledTimes(0);
            });
        });
    });
});
