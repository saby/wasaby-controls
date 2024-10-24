import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { IIcon, IIconStyle, IIconSize } from 'Controls/interface/IIcon';
import * as template from 'wml!Controls-Keyboard/_View/View';
import 'css!Controls-Keyboard/View';
import 'css!Controls/CommonClasses';

/**
 * Контрол для реализации раскладки виртуальной клавиатуры.
 * @remark
 * Дополнительно о работе с контролом читайте {@link /doc/platform/developmentapl/interface-development/controls/calc-and-keyboard/virtual-keyboard/ здесь}.
 * @class Controls-Keyboard/View
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-Keyboard-demo/Keyboard
 */
export default class Keyboard extends Control<IKeyboardOptions> {
    readonly _template: TemplateFunction = template;

    /**
     * Обработчик долгого нажатия
     * @param item элемент, на котором произошло долгое нажатие
     */
    protected _longTapHandler(event: SyntheticEvent<MouseEvent>, item: IKeyboardItem): void {
        if (!item.readOnly) {
            this._notify('itemLongTap', [item]);
        }
    }

    protected _dblClickHandler(event: SyntheticEvent<MouseEvent>, item: IKeyboardItem): void {
        if (!item.readOnly) {
            this._notify('itemDblClick', [item]);
        }
    }

    /**
     * Обработчик клика
     * @param item элемент, на котором произошел клик
     */
    protected _clickHandler(event: SyntheticEvent<MouseEvent>, item: IKeyboardItem): void {
        if (!item.readOnly) {
            this._notify('itemClick', [item]);
        }
    }

    /**
     * Получение классов элемента
     * @param item элемент
     * @param column столбец элемента
     * @param row строка элемента
     */
    protected _getItemClasses(item: IKeyboardItem, column: number, row: number): string {
        const { itemSize, itemFontSize, itemSpacing } = this._options;

        let itemClass = `Keyboard-View__item
            Keyboard-View__item_size-${itemSize}
            Keyboard-View__item_font-size-${itemFontSize}
            Keyboard-View__item_spacing-${itemSpacing}`;

        if (item.leftMarginModifier) {
            itemClass += ` Keyboard-View__item_left-margin-${item.leftMarginModifier}-${itemSize}`;
        }

        if (item.widthModifier) {
            itemClass += ` Keyboard-View__item_size-${item.widthModifier}-${itemSize}`;
        }

        if (item.readOnly) {
            itemClass += ' Keyboard-View__item_readOnly';
        } else {
            itemClass += ' Keyboard-View__item_clickable ';
            if (item.fontColorStyle) {
                itemClass += `controls-text-${item.fontColorStyle}`;
            } else {
                itemClass += `Keyboard-View__item_${item.type}`;
            }
        }

        if (column === this._options.items[row].length - 1) {
            itemClass += ' Keyboard-View__item_last';
        }

        return itemClass;
    }

    protected _getItemBackgroundClasses({
        buttonStyle,
        type,
        value,
        readOnly,
    }: IKeyboardItem): string {
        let backgroundColor = buttonStyle || this._getDefaultBackgroundClass(type);
        let classes = `Keyboard-View__item_${type}-${backgroundColor}-${
            this._options.activeItem === value ? 'active' : 'default'
        }`;
        if (readOnly) {
            classes += ' controls-background-action';
        } else if (backgroundColor !== 'translucent' && type !== 'remove') {
            if (buttonStyle === 'default') {
                backgroundColor = 'default';
            } else if (buttonStyle) {
                if (type === 'input') {
                    backgroundColor += '-same';
                } else {
                    backgroundColor = 'contrast-' + backgroundColor;
                }
            }
            classes += ` controls-background-${backgroundColor}`;
        } else {
            classes += ` Keyboard-View__item_${backgroundColor}`;
        }
        return classes;
    }

    protected _getDefaultBackgroundClass(type: string): string {
        switch (type) {
            case 'mainAction':
                return 'contrast-primary';
            case 'action':
                return 'action';
            case 'accentAction':
                return 'contrast-pale';
            case 'input':
                return 'default';
            case 'remove':
                return 'action';
        }
    }

    static getDefaultOptions(): Partial<IKeyboardOptions> {
        return {
            itemSize: 'm',
            itemSpacing: 's',
            itemFontSize: 's',
            borderVisible: false,
            shadowVisible: true,
        };
    }
}

/**
 * @typedef {String} IItemType
 * @variant input Кнопка ввода.
 * @variant action Кнопка действия.
 * @variant mainAction Кнопка основного действия с акцентным цветом фона.
 * @variant accentAction Кнопка действия с акцентным цветом текста/иконки
 * @variant remove Кнопка удаления
 */

export type IItemType = 'input' | 'action' | 'mainAction' | 'accentAction' | 'remove';

/**
 * @typedef {String} IWidthModifier
 * @variant shift
 * @variant space
 * @variant accentButton
 */

/**
 * @typedef {String} ILeftMarginModifier
 * @variant qwertySecondRow
 * @variant qwertyThirdRow
 */

/**
 * @typedef {String} TButtonStyle
 * @variant primary
 * @variant pale
 * @variant unaccented
 * @variant transparent
 */

/**
 * @typedef {Object} IKeyboardItem
 * @property {IItemType} type Тип элемента виртуальной клавиатуры. В зависимости от указанного типа, элемент примет соответствующие визуальное оформление.
 * @property {String} value Значение элемента виртуальной клавиатуры. Содержит информацию об элементе или действии для его идентификации.
 * @property {Controls/interface:IIcon} [icon] Иконка, отображаемая на элементе виртуальной клавиатуры.
 * @property {Controls/interface:IIconSize} [iconSize] Размер иконки, отображаемой на элементе виртуальной клавиатуры.
 * @property {Controls/interface:IIconStyle} [iconStyle] Стиль иконки, отображаемой на элементе виртуальной клавиатуры.
 * @property {String} [caption] Текст, отображаемый на элементе виртуальной клавиатуры.
 * @property {String} [tooltip] Текст всплывающей подсказки, отображаемой при наведении курсора мыши.
 * @property {Boolean} [readOnly] Определяет, можно ли кликнуть на кнопку
 * @property {UI/Base/TemplateFunction.typedef} [contentTemplate] Шаблон содержимого элемента
 * @property {IWidthModifier} [widthModifier] Модификатор для задания размера нестандартным кнопкам
 * @property {ILeftMarginModifier} [leftMarginModifier] Модификатор для задания левого отступа у элемента
 * @property {TButtonStyle} [buttonStyle] Опция для настройки цвета кнопки.
 * @property {Controls/interface/TFontColorStyle.typedef} [fontColorStyle] Стиль цвета текста кнопки.
 */

export interface IKeyboardItem {
    type: IItemType;
    value: string;
    icon?: IIcon;
    iconSize?: IIconSize;
    iconStyle?: IIconStyle;
    caption?: string;
    tooltip?: string;
    readOnly?: boolean;
    widthModifier?: 'shift' | 'space' | 'accentButton';
    leftMarginModifier?: 'qwertySecondRow' | 'qwertyThirdRow';
    contentTemplate?: TemplateFunction;
    buttonStyle?: 'translucent' | 'primary' | 'unaccented' | 'pale' | 'default';
    fontColorStyle?: string;
}

/**
 * @event Controls-Keyboard/View#itemClick Происходит при клике по элементу.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {IKeyboardItem} item Элемент клавиатуры, по которому произведен клик.
 * @example
 * В этом примере показано, как получить элемент по клику на него.
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls-Keyboard.View
 *     on:itemClick="_keyboardClickHandler()"
 *     items="{{_keyboardButtons}}" />
 * </pre>
 *
 * <pre class="brush: js;">
 * // TypeScript
 * protected _keyboardClickHandler(event: Event, keyboardButton: IKeyboardItem): void {
 *     this._keyPressHandler(keyboardButton);
 * }
 * </pre>
 */

/**
 * @event Controls-Keyboard/View#itemLongTap Происходит при долгом нажатии на элемент.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {IKeyboardItem} item Элемент клавиатуры, по которому произведен клик.
 */

export interface IKeyboardOptions extends IControlOptions {
    /**
     * @name Controls-Keyboard/View#items
     * @cfg {IKeyboardItem[]} Двумерный массив элементов для отображения.
     * @example
     * В данном примере показано, как задавать элементы для отображения
     * <pre class="brush: html; highlight: [3]">
     * <!-- WML -->
     * <Controls-Keyboard.View
     *     items="{{_items}}" />
     * </pre>
     * <pre class="brush: js;">
     * // TypeScript
     * import {Control, ...} from 'UI/Base';
     * ...
     * export default class MyControl extends Control<...> {
     *
     * protected _items: IKeyboardItem = [
     *     [
     *         {
     *             type: 'input',
     *             value: '1',
     *             caption: '1'
     *         }, {
     *             type: 'input',
     *             value: '2',
     *             caption: '2'
     *         }, {
     *             type: 'input',
     *             value: '3',
     *             caption: '3'
     *         }, {
     *             type: 'action',
     *             value: 'mute',
     *             icon: 'icon-MicrophoneOff icon-small'
     *         }
     *     ], [
     *         ...
     *     ],
     *     ...
     * ]
     * </pre>
     */
    items: IKeyboardItem[][];

    /**
     * @name Controls-Keyboard/View#itemSize
     * @cfg {String} Ширина и высота элемента
     * @variant s
     * @variant m
     * @variant l
     * @default m
     */
    itemSize?: 's' | 'm' | 'l';

    /**
     * @name Controls-Keyboard/View#itemSpacing
     * @cfg {String} Отступы между элементами
     * @variant s
     * @variant m
     * @variant l
     * @demo Controls-Keyboard-demo/ItemSpacing/Index
     */
    itemSpacing?: 's' | 'm' | 'l';

    /**
     * @name Controls-Keyboard/View#itemFontSize
     * @cfg {String} Размер шрифта текста в элементе
     * @variant s
     * @variant l
     */
    itemFontSize?: 's' | 'l';

    /**
     * @name Controls-Keyboard/View#itemTemplate
     * @cfg {TemplateFunction} Шаблон для настраивания передачи опций в содержимое элемента
     */
    itemTemplate?: TemplateFunction;

    /**
     * @name Controls-Keyboard/View#activeItem
     * @cfg {String} Активный элемент виртуальной клавиатуры
     */
    activeItem?: string;

    /**
     * @name Controls-Keyboard/View#borderVisible
     * @cfg {Boolean} Устанавливает рамку вокруг кнопок.
     * @default false
     * @demo Controls-Keyboard-demo/Items/Index
     */
    borderVisible?: boolean;

    /**
     * @name Controls-Keyboard/View#shadowVisible
     * @cfg {Boolean} Устанавливает тень вокруг кнопок.
     * @default true
     * @demo Controls-Keyboard-demo/Items/Index
     */
    shadowVisible?: boolean;
}
