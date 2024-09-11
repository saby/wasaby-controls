import History, { IHistoryItem } from './History';
import {
    BUTTONS,
    ERROR_MAP,
    IClearOperator,
    IKey,
    IMemoryOperator,
    IOperandSymbol,
    IOperator,
    OperatorMap,
} from '../constants';
import '../third-party/big';

// Максимальное количество символов в строке калькулятора.
// Если число превышает количество символов, оно переводится в экспоненциальный формат.
const MAX_RESULT_LENGTH = 14;

const RESULT_DECIMAL_PLACES = 5;
const MAX_PERCENT_VALUE = 100;

interface ICalculation {
    result: string;
    status: 'fail' | 'success';
}

export interface ICalculationResult {
    value: string;
    history: History;
    memoryNumber: string;
}

/**
 * Модель представления для калькулятора
 * Умеет обрабатывать ввод и возвращать его результаты
 * @private
 */
export default class ViewModel {
    private _value: string;
    private _resultValue: string;

    private _history: History;
    private _memoryNumber: string = null;

    private _lastOperand: string;
    private _lastResult: string;
    private _lastOperator: IOperator;

    private _lastHandledKey: IKey;

    private _isNewCalculation: boolean = true;
    private _shouldCalculate: boolean = false;
    private _firstActions: boolean = true;

    private get _containException(): boolean {
        return Boolean(
            Object.keys(ERROR_MAP).find((item) => {
                return ERROR_MAP[item] === this._value;
            })
        );
    }

    constructor(value: string, history: IHistoryItem[]) {
        this._value = value;
        this._history = new History(history);
    }

    get resultValue(): string {
        return this._resultValue;
    }

    /**
     * Обрабатывает нажатие клавиш и возвращает результат обработки
     * @param key
     */
    handleKey(key: IKey): ICalculationResult {
        let isHandled = false;

        if (!(this._containException && ViewModel._isOperation(key))) {
            switch (true) {
                case ViewModel._isOperand(key):
                    isHandled = this._handleOperand(key as IOperandSymbol);
                    break;
                case ViewModel._isOperator(key):
                    isHandled = this._handleOperator(key as IOperator);
                    break;
                case ViewModel._isClearOperator(key):
                    isHandled = this._handleClearOperator(key as IClearOperator);
                    break;
                case ViewModel._isMemoryOperator(key):
                    isHandled = this._handleMemoryOperator(key as IMemoryOperator);
                    break;
                case ViewModel._isNegateOperator(key):
                    isHandled = this._handleNegateOperator();
                    break;
                case ViewModel._isPercentOperator(key):
                    isHandled = this._handlePercentOperator();
                    break;
                case ViewModel._isBackspace(key):
                    isHandled = this._handleBackspace();
                    break;
                case ViewModel._isEqualsOperator(key):
                    isHandled = this._handleEqualsOperator();
                    break;
            }
        }

        if (isHandled) {
            this._lastHandledKey = key;
        }

        return {
            value: this._value,
            history: this._history,
            memoryNumber: this._memoryNumber,
        };
    }

    /**
     * Обрабатывает ввод операнда
     * @param operandSymbol
     * @private
     */
    private _handleOperand(operandSymbol: IOperandSymbol): boolean {
        const isNewInput =
            ViewModel._shouldStartNewInput(this._value, this._lastHandledKey) ||
            this._containException ||
            this._firstActions;
        let result: string;

        if (isNewInput) {
            // Если происходит ввод операнда после нажатия равно, то значит идет ввод нового выражения
            if (this._lastHandledKey === BUTTONS.EQUALS || this._containException) {
                this._lastResult = this._lastOperand = this._lastOperator = null;
            }

            if (operandSymbol === BUTTONS.DOUBLE_ZERO) {
                result = BUTTONS.ZERO;
            } else if (operandSymbol === BUTTONS.POINT) {
                result = BUTTONS.ZERO + BUTTONS.POINT;
            } else {
                result = operandSymbol;
            }
        } else {
            // При повторных нажатиях точки, не нужно ничего делать.
            // Ограничиваем количество символов которые омжно ввести.
            if (
                (operandSymbol === BUTTONS.POINT && this._value.includes(BUTTONS.POINT)) ||
                this._value.length >= MAX_RESULT_LENGTH
            ) {
                result = this._value;
            } else {
                result = this._value + operandSymbol;
            }
        }
        this._firstActions = false;
        this._value = result;
        this._history.updateOperand(this._value);

        return true;
    }

    /**
     * Обрабатаывает ввод оператора
     * @param operator
     * @private
     */
    private _handleOperator(operator: IOperator): boolean {
        if (this._value === null) {
            this._value = '0';
            this._history.updateOperator(operator);
        }

        this._prepareFractionalPart();

        if (!ViewModel._isOperator(this._lastHandledKey) && this._shouldCalculate) {
            let operationResult: string;
            const firstOperand = this._lastOperand || this._lastResult;

            // Производить подсчет выражения можно только на ввод второго оператора
            if (firstOperand && this._lastOperator && typeof this._value !== 'undefined') {
                const calculationResult = ViewModel._calculate(
                    this._lastOperator,
                    firstOperand,
                    this._value
                );
                operationResult = calculationResult.result;
            } else {
                operationResult = this._value;
            }

            this._lastResult = operationResult;
            this._value = operationResult;
        }

        if (!this._containException) {
            this._history.updateOperator(operator, this._value);
            if (ViewModel._convertToExponentialIfNeed(this._resultValue, MAX_RESULT_LENGTH) === this._value) {
                this._lastOperand = this._resultValue || this._value;
            } else {
                this._lastOperand = this._value;
            }
            this._lastOperator = operator;
            this._shouldCalculate = true;
        }

        return true;
    }

    /**
     * Обработка очищающих ввод операторов
     * @param operator
     * @private
     */
    private _handleClearOperator(operator: IClearOperator): boolean {
        this._value = null;

        if (operator === BUTTONS.CLEAR) {
            this._history.updateOperand('clear');
        } else {
            this._lastOperand = this._lastOperator = this._lastResult = null;
            this._history.clear();
        }

        return true;
    }

    /**
     * Обработка операторов работы с памятью
     * @param operator
     * @private
     */
    private _handleMemoryOperator(operator: IMemoryOperator): boolean {
        const getResult = (calculatorOperator: string) => {
            return ViewModel._calculate(
                calculatorOperator as IOperator,
                this._memoryNumber,
                this._value
            ).result;
        };
        if (operator === BUTTONS.ADD_TO_MEMORY || operator === BUTTONS.SUBTRACT_FROM_MEMORY) {
            const calculatorOperator =
                operator === BUTTONS.ADD_TO_MEMORY ? BUTTONS.ADDITION : BUTTONS.SUBTRACTION;
            const result = getResult(calculatorOperator);
            this._memoryNumber = ViewModel._convertToExponentialIfNeed(result, MAX_RESULT_LENGTH);
        } else if (operator === BUTTONS.MEMORY_CLEAR) {
            this._memoryNumber = null;
        } else if (operator === BUTTONS.MEMORY_RECALL && this._memoryNumber !== null) {
            this._value = this._memoryNumber;
            this._history.updateOperand(this._value);
        } else if (operator === BUTTONS.MEMORY_SAVE) {
            this._memoryNumber = this._value;
        }

        return true;
    }

    /**
     * Обработка оператора смены знака
     * @private
     */
    private _handleNegateOperator(): boolean {
        if (ViewModel._isInputKey(this._lastHandledKey)) {
            const value = this._value;
            let result: string;

            if (!value || (value[0] === BUTTONS.ZERO && !value.includes(BUTTONS.POINT))) {
                result = this._value;
            } else {
                result =
                    value[0] === BUTTONS.SUBTRACTION
                        ? value.substr(1)
                        : BUTTONS.SUBTRACTION + value;
            }

            this._value = result;
            this._history.updateOperand(this._value);

            return true;
        } else {
            return false;
        }
    }

    /**
     * Обработка оператора процента
     * @private
     */
    private _handlePercentOperator(): boolean {
        if (this._value) {
            const firstOperand = this._lastOperand !== null ? this._lastOperand : this._lastResult;
            this._value = ViewModel._calculatePercent(
                this._value,
                firstOperand,
                this._lastOperator
            );
            this._history.updateOperand(this._value);

            return true;
        } else {
            return false;
        }
    }

    /**
     * Обработка стирания символа
     * @private
     */
    private _handleBackspace(): boolean {
        if (ViewModel._isInputKey(this._lastHandledKey)) {
            const value = this._value;
            let result: string;

            if (value && value.length > 1) {
                // При удалении последнего символа отрицательного числа нужно присвоить 0
                if (value.length === 2 && value[0] === BUTTONS.SUBTRACTION) {
                    result = BUTTONS.ZERO;
                } else {
                    result = value.slice(0, value.length - 1);
                }
            } else {
                result = BUTTONS.ZERO;
            }
            this._history.updateOperand(result);
            // Если значение после оператора обнулилось - записываем в value значение перед оператором
            if (!result) {
                this._lastOperator = null;
                const amountOfInputs = this._history.currentCalculation.input.length;
                if (amountOfInputs) {
                    this._value = this._history.currentCalculation.input[amountOfInputs - 1].value;
                    return true;
                }
            }
            this._value = result;

            return true;
        } else if (this._containException) {
            this._value = BUTTONS.ZERO;
            this._history.updateOperand(this._value);

            return true;
        } else {
            return false;
        }
    }

    /**
     * Обработка равно
     * @private
     */
    private _handleEqualsOperator(): boolean {
        if (this._lastOperator) {
            let result: string;
            let withError: boolean;

            this._prepareFractionalPart();

            // При повторных нажатиях равно имитируем полное прохождение подсчета выражения
            // с прошлым значением и прошлым оператором
            if (this._lastHandledKey === BUTTONS.EQUALS) {
                result = ViewModel._calculate(
                    this._lastOperator,
                    this._value,
                    this._lastOperand
                ).result;
                this._history.updateOperand(this._value);
                this._history.updateOperator(this._lastOperator);
                this._history.updateOperand(this._lastOperand);
            } else {
                const firstOperand = this._isNewCalculation ? this._lastOperand : this._lastResult;
                const secondOperand = this._value !== null ? this._value : this._lastOperand;
                const calculationResult = ViewModel._calculate(
                    this._lastOperator,
                    firstOperand,
                    secondOperand
                );

                result = calculationResult.result;
                withError = calculationResult.status === 'fail';

                this._lastResult = calculationResult.result;
                this._lastOperand = this._value;

                this._history.updateOperand(secondOperand);
            }
            this._resultValue = result;

            this._shouldCalculate = false;
            this._history.endCalculation(
                ViewModel._convertToExponentialIfNeed(result, MAX_RESULT_LENGTH),
                withError
            );
            this._value = ViewModel._convertToExponentialIfNeed(result, MAX_RESULT_LENGTH);
            this._isNewCalculation = true;

            return true;
        } else {
            return false;
        }
    }

    /**
     * Убрать точку, если дробная часть пуста
     * @private
     */
    private _prepareFractionalPart(): void {
        const value = this._value;
        if (value && value[value.length - 1] === BUTTONS.POINT) {
            // Если не закончен ввод дробной части
            this._value = value.slice(0, value.length - 1);
            this._history.updateOperand(this._value);
        }
    }

    private static _convertToExponentialIfNeed(value: string, maxLength: number): string {
        try {
            return value.length > maxLength
                ? new Big(value).toExponential(RESULT_DECIMAL_PLACES)
                : value;
        } catch (e) {
            return value;
        }
    }

    private static _isOperation(key: IKey): boolean {
        return (
            ViewModel._isOperator(key) ||
            ViewModel._isEqualsOperator(key) ||
            ViewModel._isMemoryOperator(key) ||
            ViewModel._isPercentOperator(key) ||
            ViewModel._isNegateOperator(key)
        );
    }

    /**
     * Проверка на операнд
     * @param key
     * @private
     */
    private static _isOperand(key: IKey): boolean {
        return !isNaN(Number(key)) || key === BUTTONS.POINT;
    }

    /**
     * Проверка на оператор
     * @param key
     * @private
     */
    private static _isOperator(key: IKey): boolean {
        return [
            BUTTONS.ADDITION,
            BUTTONS.DIVISION,
            BUTTONS.SUBTRACTION,
            BUTTONS.MULTIPLICATION,
        ].includes(key);
    }

    /**
     * Проверка на оператор очистки ввода
     * @param key
     * @private
     */
    private static _isClearOperator(key: IKey): boolean {
        return [BUTTONS.CLEAR, BUTTONS.CLEAR_ALL].includes(key);
    }

    /**
     * Проверка на оператор работы с памятью
     * @param key
     * @private
     */
    private static _isMemoryOperator(key: IKey): boolean {
        return [
            BUTTONS.ADD_TO_MEMORY,
            BUTTONS.SUBTRACT_FROM_MEMORY,
            BUTTONS.MEMORY_RECALL,
            BUTTONS.MEMORY_CLEAR,
            BUTTONS.MEMORY_SAVE,
        ].includes(key);
    }

    /**
     * Проверка на оператор смены знака
     * @param key
     * @private
     */
    private static _isNegateOperator(key: IKey): boolean {
        return key === BUTTONS.NEGATE;
    }

    /**
     * Проверка на оператор процента
     * @param key
     * @private
     */
    private static _isPercentOperator(key: IKey): boolean {
        return key === BUTTONS.PERCENT;
    }

    /**
     * Проверка на клавишу стирания символа
     * @param key
     * @private
     */
    private static _isBackspace(key: IKey): boolean {
        return key === BUTTONS.BACKSPACE;
    }

    /**
     * Проверка на оператор равно
     * @param key
     * @private
     */
    private static _isEqualsOperator(key: IKey): boolean {
        return key === BUTTONS.EQUALS;
    }

    /**
     * Проверка на влияющие на ввод операторы
     * @param key
     * @private
     */
    private static _isInputKey(key: IKey): boolean {
        return (
            ViewModel._isOperand(key) ||
            ViewModel._isBackspace(key) ||
            ViewModel._isNegateOperator(key) ||
            ViewModel._isPercentOperator(key)
        );
    }

    /**
     * Проверка на необходимость ввода нового выражения
     * @param value
     * @param prevKey
     * @private
     */
    private static _shouldStartNewInput(value: string, prevKey: IKey): boolean {
        return (
            !value ||
            value === BUTTONS.ZERO ||
            ViewModel._isOperator(prevKey) ||
            [
                BUTTONS.PERCENT,
                BUTTONS.EQUALS,
                BUTTONS.ADD_TO_MEMORY,
                BUTTONS.SUBTRACT_FROM_MEMORY,
                BUTTONS.MEMORY_RECALL,
            ].includes(prevKey)
        );
    }

    /**
     * Производит арифмитические вычисления
     * @param operator
     * @param firstOperand
     * @param secondOperand
     * @private
     */
    private static _calculate(
        operator: IOperator,
        firstOperand: string,
        secondOperand: string
    ): ICalculation {
        const calculation = {
            result: '',
            status: null,
        };

        try {
            calculation.result = new Big<string>(firstOperand || '0')
                [OperatorMap[operator]](secondOperand || '0')
                .toString();
            calculation.status = 'success';
        } catch (err) {
            calculation.result = ERROR_MAP[err.message];
            calculation.status = 'fail';
        }

        return calculation;
    }

    /**
     * Производит вычисление процента от числа
     * @param {string} percentValue заданное число процентов
     * @param {string} lastValue значение от которого нужно найти процент
     * @param {string} operator математический оператор между введенными значениями
     * @private
     */
    private static _calculatePercent(
        percentValue: string,
        lastValue: string,
        operator: string | null
    ): string {
        // По стандарту
        // При операциях "+ | -" значение процента высчитывается относительно значения перед оператором.
        // В случае с "* | /" процента высчитывается относительно значения перед знаком "%".
        let divisor = percentValue;
        if (operator === '+' || operator === '-') {
            divisor = ViewModel._calculate(
                BUTTONS.MULTIPLICATION as IOperator,
                lastValue,
                percentValue
            ).result;
        }
        return ViewModel._calculate(BUTTONS.DIVISION as IOperator, divisor, `${MAX_PERCENT_VALUE}`)
            .result;
    }
}
