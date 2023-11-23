import { Logger } from 'UI/Utils';
import * as Utils from 'Controls/_progress/Utils';

describe('Controls/_progress/Utils', () => {
    describe('isNumber', () => {
        it('Передано корректное значение', () => {
            expect(Utils.isNumeric(10)).toBe(true);
        });
        it('Передано корректное значение с данными для логирования', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isNumeric(10, 'Bar', 'Data')).toBe(true);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Передано некорректное значение', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isNumeric('test')).toBe(false);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Передано некорректное значение с данными для логирования', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isNumeric('test', 'Bar', 'Data')).toBe(false);
            expect(mock).toHaveBeenCalledWith(
                'Bar: Data [test] is incorrect, it contains non-numeric value'
            );
            expect(mock).toHaveBeenCalledTimes(1);
        });
        it('Передано некорректное значение с данными для логирования без названия опции', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isNumeric('test', 'Bar')).toBe(false);
            expect(mock).toHaveBeenCalledWith(
                'Bar: Value [test] is incorrect, it contains non-numeric value'
            );
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });

    describe('isValueInRange', () => {
        it('Передано корректное значение', () => {
            expect(Utils.isValueInRange(10)).toBe(true);
        });
        it('Передано корректное значение с данными для логирования', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isValueInRange(10, 5, 20, 'Bar', 'Data')).toBe(true);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Передано некорректное значение', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isValueInRange(30, 5, 20)).toBe(false);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Передано некорректное значение с данными для логирования', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isValueInRange(30, 5, 20, 'Bar', 'Data')).toBe(false);
            expect(mock).toHaveBeenCalledWith('Bar: Data [30] must be in range of [5..20]');
            expect(mock).toHaveBeenCalledTimes(1);
        });
        it('Передано некорректное значение с данными для логирования без названия опции', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(Utils.isValueInRange(30, 5, 20, 'Bar')).toBe(false);
            expect(mock).toHaveBeenCalledWith('Bar: Value [30] must be in range of [5..20]');
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });
    describe('isSumInRange', () => {
        it('Передано корректное значение', () => {
            expect(
                Utils.isSumInRange([
                    { value: 10, style: 'test' },
                    { value: 20, style: 'test' },
                ])
            ).toBe(true);
        });
        it('Передано корректное значение с данными для логирования', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(
                Utils.isSumInRange(
                    [
                        { value: 10, style: 'test' },
                        { value: 20, style: 'test' },
                    ],
                    30,
                    'Bar'
                )
            ).toBe(true);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Сумма значений превышает максимально допустимое', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(
                Utils.isSumInRange([
                    { value: 100, style: 'test' },
                    { value: 20, style: 'test' },
                ])
            ).toBe(false);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Переданное значение имеет некорректный тип', () => {
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(
                Utils.isSumInRange([
                    { value: 'testValue', style: 'test' },
                    { value: 20, style: 'test' },
                ])
            ).toBe(false);
            expect(mock).not.toHaveBeenCalled();
        });
        it('Сумма значений превышает максимально допустимое и переданы данные для логирования', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(
                Utils.isSumInRange(
                    [
                        { value: 100, style: 'test' },
                        { value: 20, style: 'test' },
                    ],
                    80,
                    'Bar'
                )
            ).toBe(false);
            expect(mock).toHaveBeenCalledWith(
                'Bar: Data is incorrect. Values total is greater than 80'
            );
            expect(mock).toHaveBeenCalledTimes(1);
        });
        it('Передано значение c некорректным типом и данные для логирования', () => {
            // Проверяем, что был вызван метод логирования с ожидаемыми аргументами
            const mock = jest.spyOn(Logger, 'error').mockImplementation();
            expect(
                Utils.isSumInRange(
                    [
                        { value: 20, style: 'test' },
                        { value: 'testValue', style: 'test' },
                    ],
                    80,
                    'Bar'
                )
            ).toBe(false);
            expect(mock).toHaveBeenCalledWith('Bar: Value [testValue] is non-numeric');
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });
});
