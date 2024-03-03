import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Keyboard/_QwertyOpener/View';
import * as rk from 'i18n!Controls-Keyboard';
import { SyntheticEvent } from 'UICommon/Events';
import { focusIn, itemPressCallback, IOptionsItemPressCallback } from './QwertyHelper';
import { IQwertyOptions } from './Qwerty';
import 'css!Controls-Keyboard/_QwertyOpener/QwertyOpener';

/**
 * @event Controls-Keyboard/QwertyOpener#inputActivated Происходит при получении фокуса на поле ввода.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {HTMLInputElement} input Активное поле ввода.
 */

/**
 * @event Controls-Keyboard/QwertyOpener#inputDeactivated Происходит при потере фокуса с поля ввода.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * Интерфейс опций для обертки клавиатуры
 * @private
 */
export interface IQwertyOpener extends IQwertyOptions {
    /**
     * @name Controls-Keyboard/QwertyOpener#keyboardItemPressCallback
     * @cfg {Function} Функция, обеспечивающая взаимодействие клавиатуры. Вызывается после нажатия на клавиши клавиатуры
     */
    keyboardItemPressCallback: (options: IOptionsItemPressCallback, button: string) => void;

    /**
     * @name Controls-Keyboard/QwertyOpener#accentButtonPressCallback
     * @cfg {Function} Коллбек нажатия акцентной кнопки
     */
    accentButtonPressCallback?: (focusedInput: HTMLInputElement) => void;

    /**
     * @name Controls-Keyboard/QwertyOpener#contentClass
     * @cfg Класс для контейнера контента
     */
    contentClass?: string;
}

/**
 * Обертка для открытия клавиатуры с раскладкой QWERTY
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-Keyboard-demo/QwertyOpener/QwertyOpener
 */
export default class QwertyOpener extends Control<IQwertyOpener> {
    /**
     * Признак отображения клавиатуры
     */
    protected _visibleKeyboard: boolean;

    /**
     * Активное поле ввода
     */
    protected _focusedInput: HTMLInputElement;

    /**
     * Размер шрифта в активном поле ввода
     */
    protected _fontSizeOfInput: number;

    protected _template: TemplateFunction = template;

    /**
     * Обработчик нажатия клавиш на экранной клавиатуре
     */
    protected _keyboardItemPressCallback: (
        options: IOptionsItemPressCallback,
        button: string
    ) => void;

    /**
     * Переключить клавиатуру
     * @param show
     */
    toggleKeyboard(show: boolean): void {
        this._visibleKeyboard = show;
    }

    /**
     * Произвести частичное применение аргументов к itemPressCallback
     */
    protected _bindArgsForItemPressCallback(): void {
        const options: IOptionsItemPressCallback = {
            focusedInput: this._focusedInput,
            fontSizeOfInput: this._fontSizeOfInput,
            elemForChangeFocus: this._children.wrapper as HTMLElement,
            accentButtonPressCallback: this._options.accentButtonPressCallback || null,
        };
        this._keyboardItemPressCallback = this._options.keyboardItemPressCallback.bind(
            this,
            options
        );
    }

    /**
     * Обработчик получения фокуса
     * @param event событие фокуса
     */
    protected _onFocusIn(event: SyntheticEvent): void {
        const inputInfo = focusIn(event);
        if (!inputInfo) {
            return;
        }
        this._focusedInput = inputInfo.input;
        this._fontSizeOfInput = inputInfo.fontSizeOfInput;
        this._bindArgsForItemPressCallback();
        this.toggleKeyboard(true);
        this._notify('inputActivated', [inputInfo.input]);
    }

    /**
     * Обработчик потери фокуса
     */
    protected _onFocusOut(): void {
        this.toggleKeyboard(false);
        this._focusedInput = null;
        this._notify('inputDeactivated');
    }

    /**
     * Обработчик опускания клавиши мыши на виртуальной клавиатуре
     */
    protected _onKeyboardMouseDown(event: SyntheticEvent<MouseEvent>): void {
        // блокируем потерю фокуса у поля ввода при нажатии на клавиши виртуальной клавиатуры
        event.preventDefault();
    }

    protected _beforeUnmount(): void {
        this._keyboardItemPressCallback = null;
    }

    static getDefaultOptions(): IQwertyOpener {
        return {
            keyboardItemPressCallback: itemPressCallback,
            accentButtonCaption: rk('Найти'),
        };
    }
}
