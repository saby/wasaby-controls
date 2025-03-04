import { Model } from 'Types/entity';
import 'Types/collection';
import { getSlice } from './utils';
import { DataWrapper } from 'Controls-DataEnv/_dataFactory/Form/Slice';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Confirmation } from 'Controls/popup';

const TEXT_FIELD_KEY = 'Текстовое поле';
const NEW_TEXT_VALUE = 'Новое значение';

const mockData: Record<string, unknown> = {
    'Документ.Автор': 'Иванов И.И.',
    'Документ.Идентификатор': 666,
    'Документ.Дата создания': new Date(2023, 8, 28),
    'Документ.Подписан на бумаге': true,
    'Контрагент.Название': 'Тензор',
};

const mockLoaderRead = jest.fn((key) => {
    return Promise.resolve(new Model({ rawData: { ...mockData } }));
});
const mockLoaderWrite = jest.fn((key, store) => Promise.resolve());

describe('Controls-DataEnv/dataFactory:Form CONFIRMATION', () => {
    describe('.read()', () => {
        let slice: FormSlice;

        beforeEach(() => {
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
            });
        });

        it('should show confirm if record changed', async () => {
            const confirmSpy = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            slice.set(TEXT_FIELD_KEY, NEW_TEXT_VALUE);
            await slice.read();
            expect(confirmSpy).toBeCalled();
        });

        it('should not show confirm if record not changed', async () => {
            const confirmSpy = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            await slice.read();
            expect(confirmSpy).not.toBeCalled();
        });
    });

    describe('.setState', () => {
        let slice: FormSlice;

        beforeEach(() => {
            jest.restoreAllMocks();
            slice = getSlice({
                mockRecord: new Model({ rawData: { ...mockData } }),
                factoryArgs: {},
            });
        });

        describe('should not show confirm', () => {
            it('next value: different record, current: not changed', () => {
                const confirmSpy = jest
                    .spyOn(Confirmation, 'openPopup')
                    .mockClear()
                    .mockImplementation((args) => {
                        return Promise.resolve(true);
                    });
                const store = new DataWrapper(
                    new Model({
                        rawData: {
                            foo: 'bar',
                        },
                    })
                );
                slice.setState({ store });
                expect(confirmSpy).not.toBeCalled();
            });

            it('same record was set', () => {
                const confirmSpy = jest
                    .spyOn(Confirmation, 'openPopup')
                    .mockClear()
                    .mockImplementation((args) => {
                        return Promise.resolve(true);
                    });
                const store = slice.state.store;
                slice.setState({ store });
                expect(confirmSpy).not.toBeCalled();
            });
        });
    });
});
