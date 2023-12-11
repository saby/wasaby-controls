import { Model } from 'Types/entity';
import { IFormSlice, FormSliceActionType } from 'Controls-DataEnv/dataFactory';
import 'Types/collection';
import { getSlice, KEY, TEST_VALUE } from './utils';

const mockData: Record<string, unknown> = {
    'Документ.Автор': 'Иванов И.И.',
    'Документ.Идентификатор': 666,
    'Документ.Дата создания': new Date(2023, 8, 28),
    'Документ.Подписан на бумаге': true,
    'Контрагент.Название': 'Тензор',
};

const mockLoaderRead = jest.fn((key) => Promise.resolve(new Model({ rawData: mockData })));
const mockLoaderWrite = jest.fn((key, store) => Promise.resolve());

const onDataSave = jest.fn();
const onDataLoad = jest.fn();
const onDataChange = jest.fn();

describe('Controls-DataEnv/dataFactory:Form', () => {
    describe('With remote data via loader', () => {
        let slice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockData,
                factoryArgs: {
                    source: () => {
                        return {
                            read: mockLoaderRead,
                            update: mockLoaderWrite,
                        };
                    },
                    sourceOptions: {
                        dynamicFields: true,
                    },
                },
                onDataSave,
                onDataLoad,
                onDataChange,
            });
        });

        describe('.read', () => {
            it('should use provided Key for loader', () => {
                return slice.read().then(() => {
                    expect(mockLoaderRead).toHaveBeenCalledWith(KEY);
                });
            });

            it('should update state with store data', () => {
                return slice.read().then(() => {
                    for (const key in mockData) {
                        if (mockData.hasOwnProperty(key)) {
                            expect(slice.get(key)).toBe(mockData[key]);
                        }
                    }
                });
            });
        });

        describe('.has', () => {
            it('should return true for read store keys', () => {
                for (const key in mockData) {
                    if (mockData.hasOwnProperty(key)) {
                        expect(slice.has(key)).toBeTruthy();
                    }
                }
            });

            it('should return false for non-existing keys', () => {
                expect(slice.has('Несуществующее поле')).toBeFalsy();
            });
        });

        describe('.get', () => {
            it('should return value of read store keys', () => {
                for (const key in mockData) {
                    if (mockData.hasOwnProperty(key)) {
                        expect(slice.get(key)).toEqual(mockData[key]);
                    }
                }
            });

            it('should return undefined for non-existing keys', () => {
                expect(slice.get('Несуществующее поле')).toBeUndefined();
            });
        });

        describe('.set', () => {
            it('should set NEW value into store', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should update existing value in store', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should fire onDataChange callback', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });

            it('should not fire onDataChange callback for same value', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, mockData[FIELD]);
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing field', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });
        });

        describe('.update', () => {
            it('should call loader write with correct args', () => {
                slice.update().then(() => {
                    expect(mockLoaderWrite).toHaveBeenCalledWith(KEY, slice.store);
                });
            });

            it('should fire onDataSave with correct args', () => {
                slice.update().then(() => {
                    expect(onDataSave).toHaveBeenCalledWith(
                        slice.store,
                        FormSliceActionType.PartialUpdate
                    );
                });
            });

            it('should fire onDataSave with provided update type', () => {
                slice.update(FormSliceActionType.Save).then(() => {
                    expect(onDataSave).toHaveBeenCalledWith(slice.store, FormSliceActionType.Save);
                });
            });
        });
    });
    describe('Local data via record', () => {
        let slice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockData,
                factoryArgs: {},
                onDataSave,
                onDataLoad,
                onDataChange,
            });
        });

        describe('.read', () => {
            it('should throw error', () => {
                expect(slice.read.bind(slice)).toThrow(
                    'Controls-DataEnv/dataFactory:FormSlice Не задан источник в опции source.'
                );
            });
        });

        describe('.has', () => {
            it('should return true for read store keys', () => {
                for (const key in mockData) {
                    if (mockData.hasOwnProperty(key)) {
                        expect(slice.has(key)).toBeTruthy();
                    }
                }
            });

            it('should return false for non-existing keys', () => {
                expect(slice.has('Несуществующее поле')).toBeFalsy();
            });
        });

        describe('.get', () => {
            it('should return value of read store keys', () => {
                for (const key in mockData) {
                    if (mockData.hasOwnProperty(key)) {
                        expect(slice.get(key)).toEqual(mockData[key]);
                    }
                }
            });

            it('should return undefined for non-existing keys', () => {
                expect(slice.get('Несуществующее поле')).toBeUndefined();
            });
        });

        describe('.set', () => {
            it('should set NEW value into store', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should update existing value in store', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should fire onDataChange callback', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing field', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });
        });

        describe('.update', () => {
            it('should fire onDataSave without calling loader', () => {
                slice.update().then(() => {
                    expect(onDataSave).toBeCalled();
                    expect(mockLoaderWrite).not.toHaveBeenCalled();
                });
            });

            it('should fire onDataSave with correct args', () => {
                slice.update().then(() => {
                    expect(onDataSave).toHaveBeenCalledWith(
                        slice.store,
                        FormSliceActionType.PartialUpdate
                    );
                });
            });
        });
    });
});
