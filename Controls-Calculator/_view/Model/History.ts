import { ReactiveObject, VersionableMixin } from 'Types/entity';
import { IOperator } from '../constants';
import '../third-party/big';

export type IHistory = History | IHistoryItem[];

type IHistoryType = 'operator' | 'operand';

interface IHistoryInputItem {
    value: string;
    operator: IHistoryType;
    clear?: boolean;
}

export interface IHistoryItem {
    input: IHistoryInputItem[];
    result: string;
    isEnded: boolean;
    withError: boolean;
}

/**
 * Модель для работы с историей ввода в калькулятор
 * @private
 */
export default class History extends VersionableMixin {
    private _items: ReactiveObject<IHistoryItem>[];
    private _isClear: boolean = false;

    get currentCalculation(): ReactiveObject<IHistoryItem> {
        return this._items[this._items.length - 1];
    }

    private get _previousItem(): IHistoryItem {
        return this._items[this._items.length - 2] ? this._items[this._items.length - 2] : null;
    }

    constructor(items: IHistoryItem[]) {
        super();
        this._items = items.length
            ? items.map((item) => {
                  return new ReactiveObject(item);
              })
            : [History._createEmptyItem()];
    }

    /**
     * Возвращает всю историю
     */
    getItems(): ReactiveObject<IHistoryItem>[] {
        return this._items;
    }

    /**
     * Обновляет текущий введенный оператор
     * @remark Если до этого вводился операнд, то он метод закончит ввод операнда и введет оператор
     * @param operator
     */
    updateOperator(operator: IOperator | '=', value?: string): void {
        this._addInHistory(operator, 'operator', value);
    }

    /**
     * Обновляет текущий введенный операнд
     * @remark Если до этого вводился оператор, то он метод закончит ввод оператора и введет операнд
     * @param operand
     */
    updateOperand(operand: string): void {
        this._addInHistory(operand, 'operand');
    }

    /**
     * Заканчивает вычисление и добавляет ему результат
     * @param result
     * @param withError
     */
    endCalculation(result: string, withError: boolean = false): void {
        this.currentCalculation.result = result;
        this.currentCalculation.isEnded = true;
        this.currentCalculation.withError = withError;
        this._nextVersion();
    }

    /**
     * Заканчивает промежуточное вычисление и добавляет ему результат
     * @remark Промежуточное вычисление заканчивается когда в выражении больше одного оператора
     * например 2 + 2 + 2 = должно вывестить в истории как
     * 2 + 2 = 4
     * 4 + 2 =
     * 6
     * @param result
     */
    endIntermediateCalculation(result: string): void {
        this.updateOperator('=');
        this.updateOperand(result);
        this._startNewCalculation();
        this.updateOperand(result);
        this._nextVersion();
    }

    /**
     * Очищает всю историю
     */
    clear(): void {
        this._items = [History._createEmptyItem()];
        this._nextVersion();
    }

    /**
     * Итерирует историю
     * @param callback
     * @param context
     */
    each(callback: Function, context?: object): void {
        this._items.forEach((item, index) => {
            return callback.call(context, item, index);
        });
    }

    private _addInHistory(value: string, type: IHistoryType, initValue: string = '0'): void {
        if (this.currentCalculation.isEnded) {
            if (value !== 'clear') {
                this._startNewCalculation();
            } else {
                this._nextVersion();
                this._isClear = true;
                return;
            }
        }

        const currentInput = this.currentCalculation.input;
        const currentInputLength = currentInput.length;
        const currentInputLastItem = currentInput[currentInputLength - 1];

        if (currentInputLength) {
            if (!value) {
                currentInput.pop();
            } else if (value === 'clear') {
                currentInputLastItem.value = '';
                currentInputLastItem.clear = true;
            } else if (type === 'operand') {
                currentInputLastItem.clear = false;
                if (value[0] === '-' && currentInputLength > 1) {
                    currentInputLastItem.value = '(' + value + ')';
                } else {
                    currentInputLastItem.value = value;
                }
            } else if (type === 'operator') {
                if (currentInputLastItem.clear) {
                    currentInputLastItem.value = '0';
                }
                if (currentInputLastItem.operator !== '' && currentInputLastItem.value === '') {
                    currentInputLastItem.operator = value;
                } else {
                    currentInput.push({ value: '', operator: value });
                }
            }
        } else {
            if (type === 'operator' && currentInputLength === 0) {
                currentInput.push({ value: initValue, operator: '' });
                currentInput.push({ operator: value, value: '' });
            } else if (value !== 'clear') {
                currentInput.push({ value, operator: '' });
            }
        }
        this._isClear = false;
        this._nextVersion();
    }

    private _startNewCalculation(): void {
        this._items.push(History._createEmptyItem());
    }

    static _createEmptyItem(): ReactiveObject<IHistoryItem> {
        return {
            input: [],
            result: null,
            isEnded: false,
        };
    }
}
