import { IKeyboardItem } from 'Controls-Keyboard/View';
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { StickyOpener, IStickyPopupOptions } from 'Controls/popup';
import * as template from 'wml!Controls-Keyboard/_Qwerty/View';
import { defaultOptions, allItems, Langs } from 'Controls-Keyboard/_Qwerty/constants';
import { getSizeOfKeyboard } from 'Controls-Keyboard/QwertyHelper';
import 'css!Controls-Keyboard/_Qwerty/Qwerty';

/**
 * Интерфейс опций Qwerty клавиатуры
 * @interface Controls-Keyboard/Qwerty
 * @extends IControlOptions
 * @public
 */
export interface IQwertyOptions extends IControlOptions {
    /**
     * @name Controls-Keyboard/Qwerty#itemPressCallback
     * @cfg {Function} Функция, вызываемая после нажатия на кнопки.
     */
    itemPressCallback?: (key: string) => void;

    /**
     * @name Controls-Keyboard/Qwerty#accentButton
     * @cfg {String} Определяет текст текст в акцентной кнопке.
     */
    accentButtonCaption?: string;

    /**
     * @name Controls-Keyboard/Qwerty#getSizeOfKeyboard
     * @cfg {Function} Функция, отвечающая за логику определения размера отображения элементов.
     */
    getSizeOfKeyboard?: () => 's' | 'l';

    /**
     * @name Controls-Keyboard/Qwerty#size
     * @cfg {String} Определяет размер отображения элементов.
     * @variant s
     * @variant l
     */
    size?: 's' | 'l';

    /**
     * @name Controls-Keyboard/Qwerty#lang
     * @cfg {String} Определяет начальный язык раскладки.
     * @variant Ru
     * @variant En
     */
    lang?: 'Ru' | 'En';

    /**
     * @name Controls-Keyboard/Qwerty#itemSpacing
     * @cfg {String} Определяет отступы элементов.
     * @variant default
     * @variant s
     * @variant m
     * @variant l
     */
    itemSpacing?: 'default' | 's' | 'm' | 'l';

    /**
     * @name Controls-Keyboard/Qwerty#layout
     * @cfg {String} Определяет начальную раскладку: буквенную или символьную
     * @variant characters
     * @variant symbols
     */
    layout?: 'characters' | 'symbols';
}

/**
 * Интерфейс опций всплывающего окна Qwerty клавиатуры
 * @extends IStickyPopupOptions
 * @public
 */
export interface IQwertyPopupOptions extends IStickyPopupOptions {
    /**
     * @name Controls-Keyboard/Qwerty#templateOptions
     * @cfg {IQwertyOptions} Опция, для задания размера отображения элементов.
     */
    templateOptions: IQwertyOptions;
}

/**
 * Экранная клавиатура с раскладкой QWERTY
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-Keyboard-demo/Qwerty/Qwerty
 */
export default class Qwerty extends Control<IQwertyOptions> {
    /**
     * Шаблон клавиатуры
     */
    protected _template: TemplateFunction = template;

    /**
     * Pаскладка клавиатуры
     */
    protected _items: IKeyboardItem[][];

    /**
     * Флаг активноси Shift
     */
    protected _isShift: boolean = true;

    /**
     * Все языки
     */
    protected _AllLangs: object = Langs;

    /**
     * Текущий язык
     */
    private _lang: Langs;

    /**
     * Флаг символьной раскладки
     */
    private _isSymbols: boolean = false;

    /**
     * Флаг залипания Shift
     */
    private _isLongShift: boolean = false;

    /**
     * Предыдущая нажатая кнопка
     */
    private _lastPressButton: string;

    /**
     * Устанавливаемый размер клавиатуры
     */
    protected _size: 's' | 'l';
    protected _itemSpacing: 's' | 'm' | 'l';
    protected _itemFontSize: 'm' | 'l';

    /**
     * Изменить язык
     */
    private _changeLanguage(): void {
        // Если раскладка символьная, то переключаем на буквенную раскладку
        if (this._isSymbols) {
            this._isSymbols = false;
        }
        this._lang = this._lang === Langs.En ? Langs.Ru : Langs.En;
    }

    /**
     * Изменить раскладку буквенной клавиатуры
     */
    private _reBuildKeyboardOfChars(): void {
        this._items = allItems[this._chooseCase()].slice();
    }

    /**
     * Изменить раскладку символьной клавиатуры
     */
    private _reBuildKeyboardOfSymbols(): void {
        this._items = allItems.Symbols.slice();
    }

    /**
     * Выбор регистра в зависимости от флага активности shift
     */
    private _chooseCase(): string {
        return this._isShift ? `${Langs[this._lang]}Up` : `${Langs[this._lang]}Down`;
    }

    /**
     * Изменение флага shift
     */
    private _changeShift(): void {
        if (this._isShift && !this._isLongShift && !this._isSymbols) {
            this._isShift = false;
            this._reBuildKeyboardOfChars();
        }
    }

    /**
     * Обработчик нажатия клавиш
     */
    protected _keyboardClickHandler(event: SyntheticEvent<MouseEvent>, item: IKeyboardItem): void {
        switch (item.value) {
            case 'lang':
                this._isLongShift = false;
                this._changeLanguage();
                this._reBuildKeyboardOfChars();
                break;
            case 'shift':
                this._isLongShift = false;
                this._isShift = !this._isShift;
                this._reBuildKeyboardOfChars();
                break;
            case 'char':
                // Изменение раскладки на буквенную или символьную
                this._isLongShift = false;
                if (this._isSymbols) {
                    this._reBuildKeyboardOfChars();
                } else {
                    this._reBuildKeyboardOfSymbols();
                }
                this._isSymbols = !this._isSymbols;
                break;
            case 'keyboard':
            case 'backspace':
            case 'accentButton':
                this._options.itemPressCallback(item.value);
                break;
            default:
                this._options.itemPressCallback(item.value);
                this._changeShift();

                /* Если подряд вводятся '. ', то shift переводится в активное состояние и при
                   необходимости переключается на буквенную раскладку */
                if (this._lastPressButton === '.' && item.value === ' ') {
                    this._isShift = true;
                    this._isSymbols = false;
                    this._reBuildKeyboardOfChars();
                }

                this._lastPressButton = item.value;
        }
    }

    /**
     * Обработчик долгого нажатия клавиш
     */
    protected _keyboardLongTapHandler(
        event: SyntheticEvent<MouseEvent>,
        item: IKeyboardItem
    ): void {
        const isHandled = this._handleSpecialAction(item);
        if (!isHandled) {
            /* Если лонгтап происходит на клавишах, которые не имеют особого поведения,
                то происходит обработка подобная обычному нажатию */
            this._keyboardClickHandler(event, item);
        }
    }

    protected _keyboardDblClickHandler(
        event: SyntheticEvent<MouseEvent>,
        item: IKeyboardItem
    ): void {
        this._handleSpecialAction(item);
    }

    private _handleSpecialAction(item: IKeyboardItem): boolean {
        switch (item.value) {
            case 'Е':
                this._changeShift();
                this._options.itemPressCallback('Ё');
                return true;
            case 'е':
                this._options.itemPressCallback('ё');
                return true;
            case 'shift':
                this._isLongShift = true;
                this._isShift = true;
                this._reBuildKeyboardOfChars();
                return true;
        }
        return false;
    }

    protected _beforeMount(options: IQwertyOptions): void {
        // Если не задан размер, то установить исходя из размера окна
        this._size = options.size || options.getSizeOfKeyboard();
        this._itemFontSize = this._size === 's' ? 'm' : 'l';

        if (options.itemSpacing === 'default') {
            this._itemSpacing = this._size;
        } else {
            this._itemSpacing = options.itemSpacing;
        }

        // Если язык начальной раскладки не задан, то установить русскую
        this._lang = Langs[options.lang || 'Ru'];

        this._isSymbols = options.layout === 'symbols';
        if (this._isSymbols) {
            this._reBuildKeyboardOfSymbols();
        } else {
            this._reBuildKeyboardOfChars();
        }
    }

    /**
     * Статическое поле для хранения объекта StickyOpener
     */
    private static _sticky: StickyOpener;

    /**
     * Открыть экранную клавиатуру.
     * @param options Опции открытия всплывающего окна с клавиатурой
     * @static
     * @see close
     */
    static open(options: IQwertyPopupOptions): void {
        if (!Qwerty._sticky) {
            Qwerty._sticky = new StickyOpener();
        }

        if (!Qwerty._sticky.isOpened()) {
            Qwerty._sticky.open({
                ...defaultOptions,
                ...options,
            });
        }
    }

    /**
     * Закрыть экранную клавиатуру.
     * @static
     * @see open
     */
    static close(): void {
        if (Qwerty._sticky) {
            Qwerty._sticky.close();
        }
    }

    static getDefaultOptions(): IQwertyOptions {
        return {
            getSizeOfKeyboard,
            itemSpacing: 'default',
            layout: 'characters',
        };
    }
}
