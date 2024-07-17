import Model, { ICalculationResult } from 'Controls-Calculator/_view/Model/View';
import History from 'Controls-Calculator/_view/Model/History';
import * as constants from 'Controls-Calculator/_view/constants';
import { IKey } from 'Controls-Calculator/_view/constants';

function calculate(model: Model, input: string[]): ICalculationResult {
    return input.reduce(
        (_, item) => {
            return model.handleKey(item as IKey);
        },
        { history: null, memoryNumber: null, value: null }
    );
}

function extractHistory(result: { history: History }): string {
    let historyString = '';

    result.history.getItems().forEach((item) => {
        if (item.input.length) {
            historyString += `${item.input
                .map((item) => {
                    return `${
                        item.operator !== '' && item.value !== ''
                            ? item.operator + ' '
                            : item.operator
                    }${item.value}`;
                })
                .join(' ')}\n`;
        }

        if (item.result) {
            historyString += `${item.result}\n`;
        }
    });

    return historyString;
}

const plus = constants.BUTTONS.ADDITION;
const minus = constants.BUTTONS.SUBTRACTION;
const div = constants.BUTTONS.DIVISION;
const multiply = constants.BUTTONS.MULTIPLICATION;
const zero = constants.BUTTONS.ZERO;
const point = constants.BUTTONS.POINT;
const doubleZero = constants.BUTTONS.DOUBLE_ZERO;
const equals = constants.BUTTONS.EQUALS;
const negate = constants.BUTTONS.NEGATE;
const percent = constants.BUTTONS.PERCENT;
const clear = constants.BUTTONS.CLEAR;
const clearAll = constants.BUTTONS.CLEAR_ALL;
const backspace = constants.BUTTONS.BACKSPACE;
const addToMemory = constants.BUTTONS.ADD_TO_MEMORY;
const subToMemory = constants.BUTTONS.SUBTRACT_FROM_MEMORY;
const clearMemory = constants.BUTTONS.MEMORY_CLEAR;
const recallMemory = constants.BUTTONS.MEMORY_RECALL;
const error = constants.DIVISION_BY_ZERO_EXCEPTION;

describe('Controls-Calculator/_view/Model/View', () => {
    describe('.handleKey()', () => {
        let model: Model;

        beforeEach(() => {
            model = new Model(null, []);
        });

        const cases = [
            { name: 'Ввод операнда', expression: ['1'], result: '1' },
            { name: 'Ввод оператора', expression: ['1', plus], result: '1' },
            {
                name: 'Сложение',
                expression: ['1', plus, '1', equals],
                result: '2',
            },
            {
                name: 'Вычитание',
                expression: ['1', minus, '1', equals],
                result: '0',
            },
            {
                name: 'Умножение',
                expression: ['1', multiply, '2', equals],
                result: '2',
            },
            {
                name: 'Деление',
                expression: ['2', div, '2', equals],
                result: '1',
            },
            {
                name: 'Повторный ввод оператора',
                expression: ['1', plus, minus],
                result: '1',
            },
            {
                name: 'Ввод цепочки операторов',
                expression: ['1', plus, '2', plus],
                result: '3',
            },
            {
                name: 'Ввод равно',
                expression: ['1', plus, '2', equals],
                result: '3',
            },
            {
                name: 'Ввод равно без предыдущего оператора',
                expression: ['1', equals],
                result: '1',
            },
            {
                name: 'Повторный ввод равно',
                expression: ['1', plus, '2', equals, equals],
                result: '5',
            },
            {
                name: 'Старт новой операции',
                expression: ['1', plus, '2', equals, '1', plus, '1', equals],
                result: '2',
            },
            {
                name: 'Старт новой операции с цепочкой операторов',
                expression: ['1', plus, '2', equals, '1', plus, '1', plus],
                result: '2',
            },
            {
                name: 'Ввод точки первым символом',
                expression: [zero, '.'],
                result: '0.',
            },
            {
                name: 'Повторный ввод точки',
                expression: ['1', point, point, '1'],
                result: '1.1',
            },
            {
                name: 'Ввод нуля первым символом',
                expression: [zero],
                result: zero,
            },
            { name: 'Ввод двух нулей', expression: [doubleZero], result: '0' },
            {
                name: 'Перевод в отрицательное число',
                expression: ['2', negate],
                result: '-2',
            },
            {
                name: 'Удаление последнего символа',
                expression: ['2', '0', backspace],
                result: '2',
            },
            {
                name: 'Перевод числа в процент при сложении',
                expression: ['2', plus, '5', '0', percent],
                result: '1',
            },
            {
                name: 'Перевод числа в процент при вычитании',
                expression: ['2', minus, '5', '0', percent],
                result: '1',
            },
            {
                name: 'Перевод числа в процент при умножении',
                expression: ['2', multiply, '5', '0', percent],
                result: '0.5',
            },
            {
                name: 'Перевод числа в процент при делении',
                expression: ['2', div, '5', '0', percent],
                result: '0.5',
            },
            {
                name: 'Перевод в проценты значения',
                expression: ['2', percent],
                result: '0.02',
            },
            {
                name: 'Добавление в память',
                expression: ['2', addToMemory, clear, recallMemory, plus, '2', equals],
                result: '4',
            },
            {
                name: 'Удаление из памяти',
                expression: ['2', subToMemory, plus, recallMemory, equals],
                result: zero,
            },
            {
                name: 'Очистка памяти',
                expression: ['2', addToMemory, clearMemory, plus, '2', recallMemory, equals],
                result: '4',
            },
            {
                name: 'Удаление после операции',
                expression: ['2', plus, '2', plus, backspace, plus],
                result: '4',
            },
            { name: 'Очистка ввода', expression: ['2', clear], result: null },
            {
                name: 'Перевод в отрицательное число пустого значения',
                expression: [negate],
                result: null,
            },
            {
                name: 'Полное удаление',
                expression: ['2', backspace],
                result: '0',
            },
            {
                name: 'Ошибка при делении на 0 после нажатия равно',
                expression: ['1', div, zero, equals],
                result: error,
            },
            {
                name: 'Ошибка при делении на 0. после нажатия равно',
                expression: ['1', div, zero, point, equals],
                result: error,
            },
            {
                name: 'Ошибка при делении на 0 после нажатия оператора',
                expression: ['1', div, zero, plus],
                result: error,
            },
            {
                name: 'Ввод операторов запрещен, если в поле ошибка',
                expression: ['1', div, zero, equals, plus],
                result: error,
            },
            {
                name: 'Ввод процента запрещен, если в поле ошибка',
                expression: ['1', div, zero, equals, percent],
                result: error,
            },
            {
                name: 'Ввод смены знака запрещен, если в поле ошибка',
                expression: ['1', div, zero, equals, negate],
                result: error,
            },
            {
                name: 'Ввод операций с памятью запрещен, если в поле ошибка',
                expression: ['1', addToMemory, div, zero, equals, recallMemory],
                result: error,
            },
            {
                name: 'Ввод удаления последнего знака приводит к нулю, если в поле ошибка',
                expression: ['1', addToMemory, div, zero, equals, backspace],
                result: zero,
            },
            {
                name: 'Ввод операндов разрешен, если в поле ошибка',
                expression: ['1', div, zero, equals, '1'],
                result: '1',
            },
            {
                name: 'Ввод равно без второго операнда',
                expression: ['1', plus, equals],
                result: '2',
            },
            {
                name: 'Ввод плюса после очистки',
                expression: ['1', plus, clear, plus, equals],
                result: '2',
            },
            {
                name: 'Ввод оператора раньше операнда',
                expression: [minus, '5', minus, '6', equals],
                result: '-11',
            },
            {
                name: 'Перевод в экспоненциальную форму',
                expression: ['9999999999999999999', plus, '1', equals],
                result: '1.00000e+19',
            },
        ];

        cases.forEach((item) => {
            it(item.name, () => {
                expect(item.result).toEqual(calculate(model, item.expression).value);
            });
        });
    });

    describe('Работа с историей', () => {
        let model: Model;

        beforeEach(() => {
            model = new Model(null, []);
        });

        const cases = [
            { name: 'Ввод операнда', expression: ['1'], result: '1\n' },
            {
                name: 'Ввод оператора',
                expression: ['1', plus],
                result: '1 +\n',
            },
            {
                name: 'Повторный ввод оператора',
                expression: ['1', plus, minus],
                result: '1 -\n',
            },
            {
                name: 'Ввод двух операндов',
                expression: ['1', plus, '2'],
                result: '1 + 2\n',
            },
            {
                name: 'Подсчет результата',
                expression: ['1', plus, '2', equals],
                result: '1 + 2\n3\n',
            },
            {
                name: 'Ввод нескольких операторов',
                expression: ['1', plus, '2', minus, '3', equals],
                result: '1 + 2 - 3\n0\n',
            },
            {
                name: 'Ввод отрицательных чисел (в начале выражения)',
                expression: ['1', negate],
                result: '-1\n',
            },
            {
                name: 'Ввод отрицательных числе (в середине выражения)',
                expression: ['1', plus, '2', negate],
                result: '1 + (-2)\n',
            },
            {
                name: 'Очистка истории',
                expression: ['1', plus, '2', equals, clearAll],
                result: '',
            },
            {
                name: 'Ввод оператора без операнда',
                expression: [plus],
                result: '0 +\n',
            },
            {
                name: 'Удаление из истории',
                expression: ['1', '1', backspace],
                result: '1\n',
            },
            {
                name: 'Удаление из истории последнего символа',
                expression: ['1', backspace],
                result: '0\n',
            },
            {
                name: 'Перевод в экпоненциальную форму',
                expression: ['99999999999999', plus, '1', equals],
                result: '99999999999999 + 1\n1.00000e+14\n',
            },
            {
                name: 'Ввод равно без второго операнда',
                expression: ['1', plus, equals],
                result: '1 + 1\n2\n',
            },
            {
                name: 'Ввод плюса после очистки',
                expression: ['1', plus, clear, plus, equals],
                result: '1 + 0 + 1\n2\n',
            },
            {
                name: 'Очистка после получения результата',
                expression: ['1', plus, '2', equals, clear],
                result: '1 + 2\n3\n',
            },
            {
                name: 'Получение результата после очистка предыдущего результата',
                expression: ['1', plus, '2', equals, clear, minus, '2', equals],
                result: '1 + 2\n3\n0 - 2\n-2\n',
            },
            {
                name: 'Ввод оператора раньше операнда',
                expression: [minus, '5', minus, '6', equals],
                result: '0 - 5 - 6\n-11\n',
            },
            {
                name: 'Ввод оператора при незаполненной дробной части',
                expression: ['10', point, div, '5', point, equals],
                result: '10 / 5\n2\n',
            },
            {
                name: 'Вывод из памяти в историю',
                expression: ['2', subToMemory, recallMemory],
                result: '-2\n',
            },
        ];

        cases.forEach((item) => {
            it(item.name, () => {
                expect(item.result).toEqual(extractHistory(calculate(model, item.expression)));
            });
        });
    });

    describe('_handleMemoryOperator', () => {
        [
            {
                name: 'should add value to memory',
                value: '100',
                memoryValue: '400',
                operator: constants.BUTTONS.ADD_TO_MEMORY,
                result: '500',
            },
            {
                name: 'should subtract value from memory',
                value: '100',
                memoryValue: '400',
                operator: constants.BUTTONS.SUBTRACT_FROM_MEMORY,
                result: '300',
            },
            {
                name: 'should clear memory',
                value: '100',
                memoryValue: '400',
                operator: constants.BUTTONS.MEMORY_CLEAR,
                result: null,
            },
            {
                name: 'should set value to memory',
                value: '100',
                memoryValue: '400',
                operator: constants.BUTTONS.MEMORY_SAVE,
                result: '100',
            },
            {
                name: 'should set exponential form of number with only 5 numbers after dot',
                value: '1.51593e+26',
                memoryValue: '4.54779e+26',
                operator: constants.BUTTONS.ADD_TO_MEMORY,
                result: '6.06372e+26',
            },
        ].forEach((test) => {
            it(test.name, () => {
                const model = new Model(null, []);
                model.handleKey(test.memoryValue as constants.IOperandSymbol);
                model.handleKey(constants.BUTTONS.ADD_TO_MEMORY as constants.IKey);
                model.handleKey(test.value as constants.IOperandSymbol);
                const res = model.handleKey(test.operator as constants.IMemoryOperator);
                expect(test.result).toEqual(res.memoryNumber);
            });
        });

        it('should set memory in input', () => {
            const model = new Model(null, []);
            const result = '500';
            model.handleKey(result as constants.IKey);
            model.handleKey(constants.BUTTONS.ADD_TO_MEMORY as constants.IKey);
            model.handleKey('100' as constants.IOperandSymbol);
            const res = model.handleKey(
                constants.BUTTONS.MEMORY_RECALL as constants.IMemoryOperator
            );
            expect(result).toEqual(res.value);
        });
    });

    describe('new model with value', () => {
        it('first action = operand', () => {
            const model = new Model('10', []);
            const result = '18';
            model.handleKey('9' as constants.IKey);
            model.handleKey(constants.BUTTONS.ADDITION as constants.IKey);
            model.handleKey('9' as constants.IKey);
            const res = model.handleKey(constants.BUTTONS.EQUALS as constants.IKey);
            expect(result).toEqual(res.value);
        });
        it('first action = operator', () => {
            const model = new Model('5', []);
            const result = '13';
            model.handleKey(constants.BUTTONS.ADDITION as constants.IKey);
            model.handleKey('8' as constants.IKey);
            const res = model.handleKey(constants.BUTTONS.EQUALS as constants.IKey);
            expect(result).toEqual(res.value);
        });
    });
});
