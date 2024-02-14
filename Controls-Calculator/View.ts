import { Control, TemplateFunction } from 'UI/Base';
import { IKeyboardItem } from 'Controls-Keyboard/View';
import ICalculator, { ICalculatorOptions, IViewMode } from 'Controls-Calculator/ICalculator';
import ViewModel from './_view/Model/View';
import { IHistory } from './_view/Model/History';
import History from './_view/History';
import { constants } from 'Env/Env';
import {
    BUTTONS,
    buttonsWithAC,
    extendedButtonsWithAC,
    extendedKeyboardButtons,
    keyboardButtons as defaultButtons,
    KEY_SYMBOLS,
    ALTERNATIVE_KEY_SYMBOLS,
    SESSION_STORAGE_HISTORY_PARAM,
    IKey,
    DIVISION_BY_ZERO_EXCEPTION,
    errorButtons,
    extendedErrorButtons,
    CLEAR,
    TOGGLED_KEY_SYMBOLS,
} from './_view/constants';
import { descriptor, Guid } from 'Types/entity';
import * as template from 'wml!Controls-Calculator/_view/View';
import { SyntheticEvent } from 'UICommon/Events';
import { SessionStorage } from 'Browser/Storage';
import * as rk from 'i18n!Controls-Calculator';
import { Bus } from 'Env/Event';
import { splitIntoTriads } from 'Controls/baseDecorator';
import 'css!Controls-Calculator/View';
import 'css!Controls/CommonClasses';

const MAX_HISTORY_ITEMS = 10;
const MAX_INPUT_VALUE_LENGTH = 14;
const FRACTION_DIGITS = 5;
const EQUALS_KEY_CODE = 187;

enum inputFontSize {
    regular = '4xl',
    divisionByZeroException = 'xs',
}

/**
 * Контрол калькулятор
 * @extends UI/Base:Control
 * @implements Controls-Calculator/ICalculator
 * @control
 * @public
 * @demo Controls-Calculator-demo/Calculator/Calculator
 */
export default class View extends Control<ICalculatorOptions> implements ICalculator {
    protected _template: TemplateFunction = template;
    readonly '[Controls-Calculator/ICalculator]': boolean = true;
    protected _calculatorModel: ViewModel;
    protected _keyboardButtons: IKeyboardItem[][];
    protected _inputValue: string;
    protected _inputFontSize: inputFontSize = inputFontSize.regular;
    protected _memoryNumber: string = null;
    protected _isActive: boolean = false;
    protected _history: IHistory;
    protected _rk: rk = rk;
    protected _activeItem: string = null;
    protected _isActivate: boolean = false;
    protected _children: {
        calculationHistory: History;
    };
    private _id: string;

    protected _beforeMount(options: ICalculatorOptions): void {
        const history = SessionStorage.get(SESSION_STORAGE_HISTORY_PARAM) || [];

        this._inputValue = options.value;
        this._history = history;
        this._calculatorModel = new ViewModel(this._inputValue, history);
        this._keyboardButtons = View._getKeyboardButtons(this._inputValue, options.viewMode);
    }

    protected _afterMount(): void {
        this._id = Guid.create();
        this._notify('CalculatorRegisterCalculator', [this, this._id], {
            bubbling: true,
        });
        Bus.channel('CalculatorEvents').subscribe('numberClick', this._numberClickHandler);
    }

    protected _beforeUnmount(): void {
        this._notify('CalculatorUnregisterCalculator', [this._id], {
            bubbling: true,
        });
        Bus.channel('CalculatorEvents').unsubscribe('numberClick', this._numberClickHandler);
    }

    protected _beforeUpdate(options: ICalculatorOptions): void {
        if (options.value !== this._options.value) {
            this._inputValue = options.value;
        }
        this._keyboardButtons = View._getKeyboardButtons(this._inputValue, options.viewMode);
    }

    protected _afterRender(oldOptions: ICalculatorOptions): void {
        if (oldOptions.viewMode === 'standart' && this._options.viewMode === 'extended') {
            this._children.calculationHistory.scrollToBottom();
        }
        if (this._isActivate) {
            this._isActivate = false;
            this.activate();
        }
    }

    protected _virtualKeyboardClickHandler(event: Event, keyboardButton: IKeyboardItem): void {
        this._handleKey(keyboardButton);
        // При нажатии на +,-,/,* кнопки должны залипать
        if (TOGGLED_KEY_SYMBOLS.includes(keyboardButton.value)) {
            this._activeItem = keyboardButton.value;
        } else {
            this._activeItem = null;
        }
        if (keyboardButton.type === 'mainAction') {
            this._notifyResult();
        }
    }

    protected _getKeySymbol(nativeEvent: KeyboardEvent): IKeyboardItem {
        let keySymbol = nativeEvent.key.toLowerCase();
        keySymbol = ALTERNATIVE_KEY_SYMBOLS[keySymbol]
            ? ALTERNATIVE_KEY_SYMBOLS[keySymbol]
            : keySymbol;
        if (!nativeEvent.ctrlKey && KEY_SYMBOLS[keySymbol]) {
            return KEY_SYMBOLS[keySymbol];
        }
        return null;
    }

    protected _viewKeyDownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        const { nativeEvent } = event;
        const keySymbol = this._getKeySymbol(nativeEvent);
        if (keySymbol) {
            this._handleKey(keySymbol);
            this._activeItem = keySymbol.value;
            event.preventDefault();
        }

        if (nativeEvent.keyCode === EQUALS_KEY_CODE && !nativeEvent.shiftKey) {
            this._notifyResult();
        }

        if (nativeEvent.keyCode === constants.key.enter) {
            this._notifyResult();
        }
    }

    protected _notifyResult(): void {
        this._notify('sendResult', [this._inputValue], { bubbling: true });
    }

    protected _viewKeyUpHandler(): void {
        if (!TOGGLED_KEY_SYMBOLS.includes(this._activeItem)) {
            this._activeItem = null;
        }
    }

    protected _focusInHandler(): void {
        this._isActive = true;
    }

    protected _focusOutHandler(): void {
        this._isActive = false;
    }

    protected _prepareValue(value: string): string {
        const parsedValue = parseFloat(value);
        const isErrorMessage = isNaN(parsedValue) && typeof value === 'string';
        const isEmptyValue = value === null || value === undefined;
        if (isErrorMessage) {
            return value;
        }

        if (isEmptyValue) {
            return null;
        }
        let replacedValue = value.replace(/\s+/g, '');
        if (replacedValue) {
            if (replacedValue.length > MAX_INPUT_VALUE_LENGTH) {
                replacedValue = Number(replacedValue).toExponential(FRACTION_DIGITS);
            }
        }
        return replacedValue && !replacedValue.includes('e')
            ? splitIntoTriads(replacedValue)
            : replacedValue;
    }

    protected _handleKey(key: IKeyboardItem): void {
        const { value, history, memoryNumber } = this._calculatorModel.handleKey(key.value as IKey);
        // Т.к. в числе с экспонентой всегда будет только одна цифра до запятой, нам не нужно разделять число на триады.
        this._inputValue = this._prepareValue(value);
        this._history = history;

        if (this._memoryNumber !== memoryNumber) {
            this._memoryNumber = memoryNumber;
            this._notify('memoryNumberChanged', [this._memoryNumber]);
        }

        if (key.value === BUTTONS.EQUALS) {
            SessionStorage.set(
                SESSION_STORAGE_HISTORY_PARAM,
                this._history.getItems().slice(-MAX_HISTORY_ITEMS)
            );
            this._notify('valueChanged', [this._inputValue]);
        }

        if (key.value === BUTTONS.CLEAR_ALL) {
            SessionStorage.set(SESSION_STORAGE_HISTORY_PARAM, []);
        }

        this._inputFontSize =
            this._inputValue === DIVISION_BY_ZERO_EXCEPTION
                ? inputFontSize.divisionByZeroException
                : inputFontSize.regular;
    }

    private _numberClickHandler = (event: Event, clickedNumber: string): void => {
        let value = clickedNumber;
        value = value.replace(/ /g, '');
        value = value.replace(',', '.');

        this._handleKey(CLEAR);
        this._handleKey({ value, type: 'input' });
        /*
         * Если вызывать activate тут, то фокус в конечном итоге не будет на калькуляторе.
         * Это связано с тем, что событие прокидывается дальше. Из-за чего фокус оказывается на калькуляторе, а после пропадает.
         * Чтобы этого избежать, вызываем activate в afterRender
         */
        this._isActivate = true;
    };

    static _getKeyboardButtons(inputValue: string, viewMode: IViewMode): IKeyboardItem[][] {
        let keyboardButtons;

        if (inputValue === DIVISION_BY_ZERO_EXCEPTION) {
            if (viewMode === 'extended') {
                keyboardButtons = extendedErrorButtons;
            } else {
                keyboardButtons = errorButtons;
            }
        } else if (viewMode === 'extended') {
            keyboardButtons = inputValue ? extendedKeyboardButtons : extendedButtonsWithAC;
        } else {
            keyboardButtons = inputValue ? defaultButtons : buttonsWithAC;
        }

        return keyboardButtons;
    }

    static getDefaultOptions(): Partial<ICalculatorOptions> {
        return {
            value: null,
            viewMode: 'standart',
        };
    }

    static getOptionTypes(): object {
        return {
            value: descriptor(Number, String, null),
            viewMode: descriptor(String).oneOf(['standart', 'extended']),
        };
    }
}
