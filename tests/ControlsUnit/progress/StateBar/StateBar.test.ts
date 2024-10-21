import { _applyNewState } from 'Controls/progress';
import { Logger } from 'UI/Utils';

describe('Controls/progress:StateBar', () => {
    describe('_applyNewState', () => {
        beforeEach(() => {
            jest.spyOn(Logger, 'error').mockClear().mockImplementation();
        });

        it('Установка значений по умолчанию', () => {
            const sectors = _applyNewState({
                data: [{ value: 10 }],
            });
            expect(sectors).toEqual([
                {
                    style: 'secondary',
                    title: '',
                    value: 10,
                },
            ]);
        });

        it('Переданные сектора имеют весь набор опций', () => {
            const sectors = _applyNewState({
                data: [
                    {
                        value: 10,
                        style: 'success',
                        title: 'test1',
                    },
                    {
                        value: 20,
                        style: 'danger',
                        title: 'test3',
                    },
                ],
                align: 'right',
                blankAreaStyle: 'secondary',
            });
            expect(sectors).toEqual([
                {
                    value: 10,
                    style: 'success',
                    title: 'test1',
                },
                {
                    value: 20,
                    style: 'danger',
                    title: 'test3',
                },
            ]);
        });

        it('Сумма секторов превышает 100', () => {
            const sectors = _applyNewState({
                data: [
                    {
                        value: 20,
                        style: 'success',
                        title: 'test1',
                    },
                    {
                        value: 90,
                        style: 'danger',
                        title: 'test2',
                    },
                    {
                        value: 30,
                        style: 'warning',
                        title: 'test3',
                    },
                ],
            });
            expect(sectors).toEqual([
                {
                    value: 20,
                    style: 'success',
                    title: 'test1',
                },
                {
                    value: 80,
                    style: 'danger',
                    title: 'test2',
                },
                {
                    value: 0,
                    style: 'warning',
                    title: 'test3',
                },
            ]);
        });

        it('Сектора содержат значения 0 и 100', () => {
            const sectors = _applyNewState({
                data: [
                    {
                        value: 0,
                        style: 'success',
                        title: 'test1',
                    },
                    {
                        value: 100,
                        style: 'danger',
                        title: 'test2',
                    },
                ],
            });
            expect(sectors).toEqual([
                {
                    value: 0,
                    style: 'success',
                    title: 'test1',
                },
                {
                    value: 100,
                    style: 'danger',
                    title: 'test2',
                },
            ]);
        });

        it('Сектора содержат значения меньше нуля и больше 100', () => {
            const sectors = _applyNewState({
                data: [
                    {
                        value: -10,
                        style: 'success',
                        title: 'test1',
                    },
                    {
                        value: 30,
                        style: 'danger',
                        title: 'test2',
                    },
                    {
                        value: 120,
                        style: 'warning',
                        title: 'test3',
                    },
                ],
            });
            expect(sectors).toEqual([
                {
                    value: 0,
                    style: 'success',
                    title: 'test1',
                },
                {
                    value: 30,
                    style: 'danger',
                    title: 'test2',
                },
                {
                    value: 70,
                    style: 'warning',
                    title: 'test3',
                },
            ]);
        });

        it('Переданы нечисловые значения ширины секторов', () => {
            const sectors = _applyNewState({
                data: [
                    {
                        value: null,
                        style: 'success',
                        title: 'test1',
                    },
                    {
                        value: undefined,
                        style: 'danger',
                        title: 'test2',
                    },
                    {
                        value: '20',
                        style: 'warning',
                        title: 'test3',
                    },
                    {
                        value: ['test'],
                        style: 'warning',
                        title: 'test4',
                    },
                    {
                        value: { test: 'test' },
                        style: 'warning',
                        title: 'test5',
                    },
                ],
            });
            expect(sectors).toEqual([
                {
                    value: 0,
                    style: 'success',
                    title: 'test1',
                },
                {
                    value: 0,
                    style: 'danger',
                    title: 'test2',
                },
                {
                    value: 20,
                    style: 'warning',
                    title: 'test3',
                },
                {
                    value: 0,
                    style: 'warning',
                    title: 'test4',
                },
                {
                    value: 0,
                    style: 'warning',
                    title: 'test5',
                },
            ]);
        });
    });
});
