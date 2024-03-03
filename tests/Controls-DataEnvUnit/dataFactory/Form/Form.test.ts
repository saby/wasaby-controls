import { Model } from 'Types/entity';
import { FormSliceActionType, IFormSlice } from 'Controls-DataEnv/dataFactory';
import 'Types/collection';
import { getSlice, KEY, TEST_VALUE } from './utils';

const bindings = [
    'Документ.Автор',
    'Документ.Идентификатор',
    'Документ.Дата создания',
    'Документ.Подписан на бумаге',
    'Контрагент.Название',
];

const mockData: Record<string, unknown> = {
    'Документ.Автор': 'Иванов И.И.',
    'Документ.Идентификатор': 666,
    'Документ.Дата создания': new Date(2023, 8, 28),
    'Документ.Подписан на бумаге': true,
    'Контрагент.Название': 'Тензор',
};

const mockUserData: Record<string, unknown> = {
    'UserData.Поле1': 'Значение поля 1',
};

const mockRecord = new Model({});
mockRecord.set('record', new Model({ rawData: { ...mockData } }));
mockRecord.set('UserData', new Model({ rawData: mockUserData }));

const mockLoaderRead = jest.fn((key) => {
    return Promise.resolve(mockRecord);
});
const mockLoaderWrite = jest.fn((key, store) => Promise.resolve());

const onDataSave = jest.fn();
const onDataLoad = jest.fn();
const onDataChange = jest.fn();

describe('Controls-DataEnv/dataFactory:Form', () => {
    describe('With remote data via compatibility loader', () => {
        let slice: IFormSlice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockRecord: new Model({ rawData: { ...mockData } }),
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
                    expect(mockLoaderRead).toHaveBeenCalledWith(KEY, undefined);
                });
            });

            it('should update state with store data', () => {
                return slice.read().then(() => {
                    for (const key of bindings) {
                        expect(slice.store.getStore().get('record').get(key)).toBe(mockData[key]);
                    }
                });
            });
        });

        describe('.has', () => {
            it('should return true for read store keys', () => {
                for (const key of bindings) {
                    expect(slice.has(key)).toBeTruthy();
                }
            });

            it('should return false for non-existing keys', () => {
                expect(slice.has('Несуществующее поле')).toBeFalsy();
            });
        });

        describe('.get', () => {
            it('should return value of read store keys', () => {
                for (const key of bindings) {
                    expect(slice.get(key)).toEqual(mockData[key]);
                }
            });

            it('should return undefined for non-existing keys', () => {
                expect(slice.get('Несуществующее поле')).toBeUndefined();
            });
        });

        describe('.set', () => {
            it('should update existing value in store', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should fire onDataChange callback', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, 'Новое значение');
                expect(onDataChange).toBeCalled();
            });

            it('should not fire onDataChange callback for same value', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, mockData[FIELD]);
                expect(onDataChange).not.toBeCalled();
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
        let slice: IFormSlice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockRecord: new Model({ rawData: { ...mockData } }),
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
                for (const key of bindings) {
                    expect(slice.has(key)).toBeTruthy();
                }
            });

            it('should return false for non-existing keys', () => {
                expect(slice.has('Несуществующее поле')).toBeFalsy();
            });
        });

        describe('.get', () => {
            it('should return value of read store keys', () => {
                for (const key of bindings) {
                    expect(slice.get(key)).toEqual(mockData[key]);
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
                slice.set(FIELD, 'Новое значение');
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing field', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing UserData field', () => {
                const FIELD = 'UserData.Тестовое поле';
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
    describe('Hierarchial data via record', () => {
        let slice: IFormSlice;
        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockRecord: new Model({
                    rawData: {
                        Документ: {
                            Автор: 'Иванов И.И.',
                            Идентификатор: 666,
                            'Дата создания': new Date(2023, 8, 28),
                            'Подписан на бумаге': true,
                        },
                        Контрагент: {
                            Название: 'Тензор',
                            Руководитель: {
                                Фамилия: 'Иванов',
                                Имя: 'Иван',
                                Отчество: 'Иванович',
                            },
                        },
                    },
                }),
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
                for (const key of bindings) {
                    expect(slice.has(key)).toBeTruthy();
                }
            });

            it('should return false for non-existing keys', () => {
                expect(slice.has('Несуществующее поле')).toBeFalsy();
            });
        });

        describe('.get', () => {
            it('should return value of read store keys', () => {
                for (const key of bindings) {
                    expect(slice.get(key)).toEqual(mockData[key]);
                }
            });

            it('should return undefined for non-existing keys', () => {
                expect(slice.get('Несуществующее поле')).toBeUndefined();
            });

            it('should return native object value', () => {
                expect(slice.get('Контрагент.Руководитель.Фамилия')).toEqual('Иванов');
            });
        });

        describe('.set', () => {
            it('should set NEW value into store', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should set native object value', () => {
                slice.set('Контрагент.Руководитель.Фамилия', 'Петров');
                expect(slice.get('Контрагент.Руководитель').Фамилия).toEqual('Петров');
            });

            it('should update existing value in store', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, TEST_VALUE);
                expect(slice.get(FIELD)).toEqual(TEST_VALUE);
            });

            it('should fire onDataChange callback', () => {
                const FIELD = 'Документ.Автор';
                slice.set(FIELD, 'Новое значение');
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing field', () => {
                const FIELD = 'Тестовое поле';
                slice.set(FIELD, 'Новое значение');
                expect(onDataChange).toBeCalled();
            });

            it('should fire onDataChange callback for non-existing UserData field', () => {
                const FIELD = 'UserData.Тестовое поле';
                slice.set(FIELD, TEST_VALUE);
                expect(onDataChange).toBeCalled();
            });
        });
    });
});
